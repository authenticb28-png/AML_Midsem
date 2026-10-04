# Advanced Machine Learning — Coding & Lab Questions

## Lectures

### CN_lab_ALB_Section_D — 14 Sep 2026

#### CN_Lab: Application Load Balancer
_Network lab (simulator) · Medium · Solved ✓ · 20/20 pts_

###### In-Class Lab – Build a Highly Available Web App with an Application Load Balancer

In this lab you will build a fault-tolerant web architecture on AWS from scratch. Two web servers, each in a different data-centre zone, sit behind an **Application Load Balancer (ALB)** that distributes traffic between them. You will then deliberately stop one server and watch the ALB silently switch all traffic to the surviving one — with zero changes on your part.

###### Architecture you will build

```

              Internet
                 │
       ┌─────────▼──────────┐
       │ Application Load   │
       │     Balancer       │
       └────────┬───────────┘
                │
       ┌────────▼───────────┐
       │    Target Group    │
       └──────┬─────────────┘
              │
   ┌──────────┴──────────┐
   │                     │
┌──▼────────┐      ┌─────▼──────┐
│  EC2-A    │      │   EC2-B    │
│  AZ-1     │      │   AZ-2     │
│ "Instance │      │ "Instance  │
│    A"     │      │    B"      │
└───────────┘      └────────────┘
```

EC2-A and EC2-B serve **different pages** so you can see exactly which instance the ALB is sending you to. When EC2-A is stopped, every reload will show EC2-B's page — no error, no downtime.

---

###### ⚠ Tag Rule — apply to every resource you create

| Key | Value |
| --- | --- |
| `Project` | `ha-web-app` |

The grader finds your work by this tag. A resource without it is invisible to the grader.

Region for this entire lab: **us-east-1 (N. Virginia)**

---

###### Part 1 – Create the VPC and Network

###### Step 1.1 – Create the VPC

1. Search for **VPC** in the AWS Console. Open the VPC service.
2. Left menu → **Your VPCs** → **Create VPC**.
3. Select **VPC only**.
4. Fill in:

   | Field | Value |
   | --- | --- |
   | Name tag | `ha-vpc` |
   | IPv4 CIDR | `10.0.0.0/16` |
   | Tenancy | Default |
5. Tags → add `Project` = `ha-web-app`. Click **Create VPC**.

###### Step 1.2 – Create Subnet A (AZ us-east-1a)

1. Left menu → **Subnets** → **Create subnet**.
2. VPC: select `ha-vpc`.
3. Subnet settings:

   | Field | Value |
   | --- | --- |
   | Subnet name | `ha-subnet-az1` |
   | Availability Zone | `us-east-1a` |
   | IPv4 CIDR | `10.0.1.0/24` |
4. Add tag `Project` = `ha-web-app`.

###### Step 1.3 – Create Subnet B (AZ us-east-1b)

Click **Add new subnet** on the same page:

| Field | Value |
| --- | --- |
| Subnet name | `ha-subnet-az2` |
| Availability Zone | `us-east-1b` |
| IPv4 CIDR | `10.0.2.0/24` |

Add tag `Project` = `ha-web-app`. Click **Create subnet**.

###### Step 1.4 – Enable auto-assign public IP on both subnets

1. Select `ha-subnet-az1` → **Actions → Edit subnet settings**.
2. Check **Enable auto-assign public IPv4 address** → Save.
3. Repeat for `ha-subnet-az2`.

###### Step 1.5 – Create and attach an Internet Gateway

1. Left menu → **Internet Gateways** → **Create internet gateway**.
2. Name: `ha-igw`. Tag `Project` = `ha-web-app`. Create.
3. **Actions → Attach to VPC** → select `ha-vpc` → Attach.

###### Step 1.6 – Create a route table and connect it to the subnets

1. Left menu → **Route Tables** → **Create route table**.
2. Name: `ha-public-rt`. VPC: `ha-vpc`. Tag `Project` = `ha-web-app`. Create.
3. Select `ha-public-rt` → **Routes** tab → **Edit routes** → **Add route**:

   | Destination | Target |
   | --- | --- |
   | `0.0.0.0/0` | Internet Gateway → `ha-igw` |

   Save changes.
4. **Subnet associations** tab → **Edit subnet associations** → check both `ha-subnet-az1` and `ha-subnet-az2` → Save.

---

###### Part 2 – Create Security Groups

We use two security groups: one for the ALB (accepts traffic from the internet) and one for the EC2 instances (accepts traffic *only from the ALB*, never directly from the internet). This is called **security group chaining**.

###### Step 2.1 – ALB Security Group

1. Left menu → **Security Groups** → **Create security group**.
2. | Field | Value |
   | --- | --- |
   | Name | `ha-alb-sg` |
   | Description | Allow HTTP from internet to ALB |
   | VPC | `ha-vpc` |
3. Inbound rule: Type **HTTP**, Port **80**, Source **Anywhere-IPv4**.
4. Tag `Project` = `ha-web-app`. Create.

###### Step 2.2 – EC2 Security Group

1. Create security group again.
2. | Field | Value |
   | --- | --- |
   | Name | `ha-ec2-sg` |
   | Description | Allow HTTP only from ALB SG |
   | VPC | `ha-vpc` |
3. Add **two** inbound rules:

   | Type | Port | Source | Reason |
   | --- | --- | --- | --- |
   | HTTP | 80 | Custom → `ha-alb-sg` | Only the ALB can send web traffic in |
   | SSH | 22 | Anywhere-IPv4 | Troubleshooting access |

   For the HTTP rule, click the Source dropdown and select **Custom**, then search for and select `ha-alb-sg`.
4. Tag `Project` = `ha-web-app`. Create.

---

###### Part 3 – Launch EC2-A (Availability Zone 1)

EC2-A will serve a blue-themed page that says **"Instance A"**. This makes it visually clear which instance the ALB is routing to.

1. Search for **EC2** in the console. Click **Launch instance**.
2. Name: `ha-ec2-a`.
3. AMI: **Amazon Linux 2023 AMI** (default, leave as-is).
4. Instance type: `t2.micro`.
5. Key pair: select **vockey**.
6. Network settings → click **Edit**:

   | Field | Value |
   | --- | --- |
   | VPC | `ha-vpc` |
   | Subnet | `ha-subnet-az1` (us-east-1a) |
   | Auto-assign public IP | Enable |
   | Security group | Select existing → `ha-ec2-sg` |
7. Scroll down to **Advanced details** → expand → scroll to the bottom to find **User data**.
8. Paste the following script into the User data box:

   ```
   
   #!/bin/bash
   dnf install -y httpd
   systemctl start httpd
   systemctl enable httpd
   cat > /var/www/html/index.html << 'EOF'
   <!DOCTYPE html>
   <html>
   <head><title>Instance A</title></head>
   <body style="font-family:sans-serif; padding:40px; background:#dbeafe;">
     <h1>You are on Instance A</h1>
     <p>Availability Zone: <strong>us-east-1a</strong></p>
     <p>The ALB routed your request to <strong>EC2-A</strong>.</p>
   </body>
   </html>
   EOF
   ```
9. Tags → add `Project` = `ha-web-app`.
10. Click **Launch instance**.

---

###### Part 4 – Launch EC2-B (Availability Zone 2)

EC2-B will serve a green-themed page that says **"Instance B"**. When EC2-A is stopped, the browser will switch to this green page — proving the ALB shifted traffic automatically.

1. Click **Launch instance** again.
2. Name: `ha-ec2-b`.
3. AMI: **Amazon Linux 2023 AMI**.
4. Instance type: `t2.micro`.
5. Key pair: select **vockey**.
6. Network settings → click **Edit**:

   | Field | Value |
   | --- | --- |
   | VPC | `ha-vpc` |
   | Subnet | `ha-subnet-az2` (us-east-1b) |
   | Auto-assign public IP | Enable |
   | Security group | Select existing → `ha-ec2-sg` |
7. Scroll to **User data** and paste this *different* script:

   ```
   
   #!/bin/bash
   dnf install -y httpd
   systemctl start httpd
   systemctl enable httpd
   cat > /var/www/html/index.html << 'EOF'
   <!DOCTYPE html>
   <html>
   <head><title>Instance B</title></head>
   <body style="font-family:sans-serif; padding:40px; background:#dcfce7;">
     <h1>You are on Instance B</h1>
     <p>Availability Zone: <strong>us-east-1b</strong></p>
     <p>The ALB routed your request to <strong>EC2-B</strong>.</p>
   </body>
   </html>
   EOF
   ```
8. Tags → add `Project` = `ha-web-app`.
9. Click **Launch instance**.

Wait until both instances show **Instance state: Running** before continuing.

---

###### Part 5 – Create the Target Group

A **Target Group** holds the list of EC2 instances the ALB sends traffic to. The ALB continuously health-checks each target — if a target stops responding, the ALB removes it from rotation automatically.

1. In the EC2 left menu scroll down to **Target Groups** → **Create target group**.
2. Target type: **Instances**.
3. | Field | Value |
   | --- | --- |
   | Target group name | `ha-tg` |
   | Protocol | HTTP |
   | Port | 80 |
   | VPC | `ha-vpc` |
   | Protocol version | HTTP1 |
4. Health checks: Protocol HTTP, Path `/`. Leave other defaults.
5. Click **Next**.
6. On the **Register targets** page: check both `ha-ec2-a` and `ha-ec2-b` → click **Include as pending below** → **Create target group**.
7. Find `ha-tg` in the list → **Tags** tab → add `Project` = `ha-web-app`.

---

###### Part 6 – Create the Application Load Balancer

1. EC2 left menu → **Load Balancers** → **Create load balancer**.
2. Choose **Application Load Balancer** → Create.
3. | Field | Value |
   | --- | --- |
   | Name | `ha-alb` |
   | Scheme | **Internet-facing** |
   | IP address type | IPv4 |
4. Network mapping: VPC = `ha-vpc`. Check **us-east-1a** → `ha-subnet-az1`. Check **us-east-1b** → `ha-subnet-az2`.
5. Security groups: remove the default, select `ha-alb-sg`.
6. Listeners: Protocol HTTP, Port 80, Default action → Forward to `ha-tg`.
7. Tags → add `Project` = `ha-web-app`.
8. Click **Create load balancer**.
9. Once created, open `ha-alb` and copy the **DNS name** (e.g. `ha-alb-xxxxxxxx.us-east-1.elb.amazonaws.com`). This is your test URL.

---

###### Part 7 – Verify the Setup

###### Step 7.1 – Wait for both targets to become healthy

1. **EC2 → Target Groups → ha-tg → Targets** tab.
2. Wait until both `ha-ec2-a` and `ha-ec2-b` show **Status: healthy**. This takes 2–3 minutes while Apache installs on boot.
3. Do not proceed until both are healthy.

###### Step 7.2 – Test in your browser

1. Open a new tab: `http://<your-ALB-DNS-name>`
2. You will see either the **blue "Instance A"** page or the **green "Instance B"** page.
3. Reload several times — the colour and instance name should alternate as the ALB round-robins between the two servers.

---

###### Part 8 – Simulate a Server Failure

You will now **stop EC2-A** (not terminate — stop is reversible). The ALB's health check will detect that EC2-A is no longer responding and will route 100% of traffic to EC2-B.

###### Step 8.1 – Stop EC2-A

1. Go to **EC2 → Instances**.
2. Select `ha-ec2-a`.
3. Click **Instance state → Stop instance** → confirm.

###### Step 8.2 – Watch the health check fail

1. Go to **Target Groups → ha-tg → Targets**.
2. Refresh every 15–20 seconds. You will see `ha-ec2-a`'s status change from **healthy** → **draining** → **unhealthy**.
3. The ALB stops sending traffic to an unhealthy target within one health-check cycle.

###### Step 8.3 – Test the ALB immediately

1. Go back to your browser tab and reload the page.
2. Every response now shows the **green "Instance B"** page — the ALB has silently routed all traffic to the surviving server.
3. There was no error page, no restart required, no manual action from you.

###### Step 8.4 – Bring EC2-A back (optional)

1. Select `ha-ec2-a` → **Instance state → Start instance**.
2. Wait for it to pass health checks in the target group again (2–3 min).
3. Reload the browser — the page alternates between blue and green again. Capacity fully restored.

---

###### Part 9 – Submit for Validation

**Before submitting:** make sure both instances are running and both show **Status: healthy** in the target group. The grader checks this live.

1. Go to the **Learner Lab** page → click **AWS Details**.
2. Copy the **Access Key ID**, **Secret Access Key**, and **Session Token** into the form below.
3. For Region enter **us-east-1**.
4. Submit. The grader reads your account read-only and checks each item below.

**Note:** Credentials expire when your lab session ends (~4 hours). Build and submit in one session.

---

###### What the grader checks

| Check | What it verifies | Common reason to fail |
| --- | --- | --- |
| VPC exists | A custom VPC tagged `ha-web-app` exists in us-east-1 | Used default VPC, or forgot the tag |
| Subnets in ≥2 AZs | At least 2 subnets in different Availability Zones | Both subnets accidentally in the same AZ |
| Internet Gateway attached | IGW exists and is attached to the VPC | Created IGW but forgot to attach it |
| Security group chaining | EC2 instances accept port 80 only from `ha-alb-sg`, not from the internet directly | Set EC2 SG source to 0.0.0.0/0 instead of the ALB SG |
| Internet-facing ALB across ≥2 AZs | ALB scheme is internet-facing and spans both AZs | ALB in only one AZ, or set to internal |
| 2 healthy targets | Both EC2-A and EC2-B are registered and passing health checks | Apache not installed, wrong port, instances not registered to TG, or EC2-A still stopped |
| Site responds via ALB | The ALB DNS name returns HTTP 200 | Listener not configured, wrong security group on ALB |



## Labs

### Python-Exploratory Data Analysis (EDA), Handling missing values, Outlier Detecti ... - In Class — 17 Aug 2026

#### Basic Data Preprocessing
_Notebook (Newton Box) · Easy · Solved ✓ · 20/20 pts_

You are given a synthetic dataset file **employee.csv** containing columns: Name, Age, Salary, Department. The dataset contains missing values and duplicate rows. Use the provided notebook to complete the tasks below.

Tasks

- - **Load data**: Read **employee.csv** into a DataFrame and display the first rows and shape.
  - **Inspect quality**: Compute and report the total number of missing values and the number of duplicate rows (before any changes).
  - **Impute missing values**: Fill missing values in Age and Salary using the column mean; show counts of missing values before and after imputation.
  - **Remove duplicates**: Identify duplicate rows, remove them, and report the DataFrame shape before and after deduplication.

_Solved in Newton Box — your notebook code stays on Newton (not exportable)._


### Python-Exploratory Data Analysis (EDA), Handling missing values, Outlier Detecti ... - Post Class — 17 Aug 2026

#### Data Preprocessing Exercise
_Notebook (Newton Box) · Easy · Solved ✓ · 20/20 pts_

The file contains booking records across various **properties and platforms**. Each **row** captures details about a **single booking**, from when it was made to its outcome, along with **customer ratings and revenue figures**.  
Note:  
**revenue\_generated**: Total revenue expected from the booking before any cancellations or losses.  
**revenue\_realized**: Actual revenue received by the hotel after any cancellations or refunds.  
  
  
**Try out the questions given in the form of tasks**  
  
**Task 1**:  
Update the function check\_duplicate and return the total duplicate count.

**Task 2**:   
Find the mean of the revenue\_generated.  
  
**Task 3**:   
Find the percentage of null cells that are there in the data

**Task 4:**  
Find the room category that has the maximum bookings.  
  
**Task 5:**  
Find the total booking that got cancelled.

_Solved in Newton Box — your notebook code stays on Newton (not exportable)._


### Feature Scaling, Normalization, Standardization, Max Absolute Scaling, Robust Sc ... - In Class — 19 Aug 2026

#### Data Preprocessing
_Notebook (Newton Box) · Hard · Solved ✓ · 40/40 pts_

###### Data Preprocessing Challenge: Customer Engagement Analysis (Simple Version)

**Context:** You are a Data Analyst at a tech company specializing in subscription-based services. You've been provided with a raw, "messy" dataset containing information about customer engagement and subscription status. Your goal is to preprocess this data to make it suitable for machine learning model training. The key challenges involve handling various data quality issues.

**Objective:** Clean and prepare the `preprocessing_question_data_simple.csv` dataset by performing the following steps:

1. **Load the Dataset**
2. **Handle Duplicate Values**
3. **Address Missing Values**
4. **Encode Categorical Features**
5. **Perform Standardization for Numerical Features  
     
   Handle Missing value**

**Dataset Description (`preprocessing_question_data_simple.csv`):**

- `CustomerID`: Unique identifier for each customer. (Should be dropped)
- `Age`: Customer's age in years. (Numerical, includes missing values, needs standardization)
- `Product_Category`: The primary product category the customer engages with. (Nominal Categorical, includes missing values, consistent casing)
- `Monthly_Spend`: Average monthly expenditure by the customer. (Numerical, includes missing values, has outliers, needs standardization)
- `Has_Subscription`: Binary target variable (0 = No Subscription, 1 = Has Subscription). (Binary, target variable)

_Solved in Newton Box — your notebook code stays on Newton (not exportable)._


#### Data Preprocessing pipeline 1
_Notebook (Newton Box) · Hard · Solved ✓ · 40/40 pts_

**Your task is to build a preprocessing pipeline that:**

1. Fills missing values in **numeric columns** (`Age`, `Score`) using their **mean** with `fillna()`
2. Fills missing values in **categorical columns** (`Gender`, `City`) using their **mode** with `fillna()`
3. Applies **Label Encoding** on `Gender` (binary category)
4. Applies **One-Hot Encoding** on `City` (multi-class category)
5. Applies **Standard Scaling** on `Age` and **Min-Max Scaling** on `Score`
6. Prints the **final preprocessed DataFrame**

_Solved in Newton Box — your notebook code stays on Newton (not exportable)._


### Gradient Descent, Optimization, Gradient, Batch Gradient Descent, Learning Rate, ... - In Class — 31 Aug 2026

#### Batch Gradient Descent for Linear Regression
_Coding · Medium · Solved ✓ · 20/20 pts_

In this problem, you will implement a simplified version of Batch Gradient Descent (BGD).  
The model contains only a weight `w`. **The bias term is fixed at 0.**  
Model: `y = w × x`  
  
**What You Need to Implement:**Starting with `w = 0`, train the model for the given number of epochs.

```

1. Initialize w = 0.
2. Set the random seed to 42 using numpy.
3. For each epoch (repeat `epochs` times):
     * For every data point (x_i, y_i), compute its own gradient contribution:
         prediction_i = w × x_i
         grad_i = 2 × (prediction_i − y_i) × x_i
     * Average all N gradient contributions together:
         dw = (grad_1 + grad_2 + ... + grad_N) / N
     * Update the weight ONCE, using the averaged gradient:
         w = w − learning_rate × dw
4. After all epochs are complete, return w rounded to 2 decimal places.
```

**Input**

The first line contains an integer N, representing the number of data points.
The next N lines each contain two space-separated numbers x and y.
x represents the input feature.
y represents the target value.
The next line contains a floating point number learning\_rate.
The last line contains an integer epochs, representing the number of times the dataset should be processed.

**Output**

Print the final value of w after completing all Batch Gradient Descent updates, rounded to 2 decimal places.

**Example**

Example 1:
Input:
10
1 0.5
2 1
3 1.5
4 2
5 2.5
6 3
7 3.5
8 4
9 4.5
10 5
0.001
500
Output:
0.5
Example 2:
Input:
3
1 2
2 4
3 6
0.001
100
Output:
1.22

**Constraints**

1 <= N <= 10^4
1 <= epochs <= 10^3
-1000 <= x, y <= 1000
0 < learning\_rate <= 1

**My solution** (Python (3.12.7) for ML)

```python
import numpy as np

def train_bgd(x, y, learning_rate, epochs):
    np.random.seed(42)
    
    x = np.array(x, dtype=np.float64)
    y = np.array(y, dtype=np.float64)
    
    w = 0.0
    N = len(x)
    
    for _ in range(epochs):
        predictions = w * x
        dw = np.mean(2 * (predictions - y) * x)
        w = w - learning_rate * dw
        
    return round(w, 2)
```


### Gradient Descent, Optimization, Gradient, Batch Gradient Descent, Learning Rate, ... - Post Class — 31 Aug 2026

#### Compute the Best-Fit Line (Ordinary Least Squares)
_Coding · Hard · Solved ✓ · 40/40 pts_

The regression equation is <inlineMath>\hat{y}=mx+b</inlineMath>, where <inlineMath>m</inlineMath> is the slope and <inlineMath>b</inlineMath> is the intercept. Compute the slope using:  
  
<inlineMath>m=\frac{\sum\_{i=1}^{n}(x\_i-\bar{x})(y\_i-\bar{y})}{\sum\_{i=1}^{n}(x\_i-\bar{x})^2}</inlineMath>  
  
Compute the intercept using <inlineMath>b=\bar{y}-m\bar{x}</inlineMath>. Return both values rounded to 2 decimal places. If all values in <inlineMath>x</inlineMath> are identical (making the denominator zero), return <inlineMath>[-1.0,-1.0]</inlineMath>.  
  
Definitions:  
  
• <inlineMath>x\_i</inlineMath> is the <inlineMath>i</inlineMath>-th value of the <inlineMath>X</inlineMath> variable.  
  • If <inlineMath>i=1</inlineMath>, then <inlineMath>x\_1</inlineMath> is the first <inlineMath>X</inlineMath> value.  
  • If <inlineMath>i=2</inlineMath>, then <inlineMath>x\_2</inlineMath> is the second <inlineMath>X</inlineMath> value.  
  • And so on.  
  
• <inlineMath>\bar{x}</inlineMath> (pronounced "x bar") is the mean (average) of all <inlineMath>X</inlineMath> values.  
  
<inlineMath>\bar{x}=\frac{x\_1+x\_2+\cdots+x\_n}{n}</inlineMath>  
  
Similarly,  
  
• <inlineMath>y\_i</inlineMath> is the <inlineMath>i</inlineMath>-th value of the <inlineMath>Y</inlineMath> variable.  
  
• <inlineMath>\bar{y}</inlineMath> (pronounced "y bar") is the mean (average) of all <inlineMath>Y</inlineMath> values.  
  
<inlineMath>\bar{y}=\frac{y\_1+y\_2+\cdots+y\_n}{n}</inlineMath>

**Input**

The first line contains an integer n, the number of observations.
The second line contains n space-separated real numbers representing the array x.
The third line contains n space-separated real numbers representing the array y.

**Output**

Print space-separated numbers:
the slope (m)
the intercept (b)
Both values must be rounded to 2 decimal places.
If the regression line cannot be computed, print [-1.0,-1.0]

**Example**

input :
5
1 2 3 4 5
2 4 5 4 5
output :
0.60 2.20

**Constraints**

1 ≤ n ≤ 10^5
len(x)==len(y)
-10^6 ≤ x[i],y[i] ≤ 10^6
Values may be integers or floating-point numbers.

**My solution** (Python (3.12.7) for ML)

```python
def compute_ols(x, y):
    n = len(x)
    if n == 0:
        return [-1.0, -1.0]

    x_bar = sum(x) / n
    y_bar = sum(y) / n

    numerator = sum((xi - x_bar) * (yi - y_bar) for xi, yi in zip(x, y))
    denominator = sum((xi - x_bar) ** 2 for xi in x)

    # If denominator is 0 (all x values are identical)
    if denominator == 0:
        return [-1.0, -1.0]

    m = numerator / denominator
    b = y_bar - m * x_bar

    return [round(m, 2), round(b, 2)]
```


#### OLS Method implementation
_Coding · Hard · Attempted · 0/40 pts_

You are given a training dataset containing multiple input features and a target value for each sample.

Implement the function `fit_multiple_lr_beta(X, y)` to calculate the **Multiple Linear Regression** coefficients (**β**) from scratch using the **Ordinary Least Squares (OLS)** Normal Equation.

For **Multiple Linear Regression (MLR)**, the prediction equation (hypothesis) using the **Ordinary Least Squares (OLS)** method is:

  ŷ = β0 + β1x1 + β2x2 + … + βnxn

Or in matrix notation:

**ŷ = Xβ**

Matrix Representation  
  
![](https://quicklatex.com/cache3/ca/ql_7482b6b37b20b633351238dbbf3cd6ca_l3.png)

The **Normal Equation** used to compute the coefficient vector is:

**β = (XTX)−1XTy**

Your implementation must perform the computation **step-by-step**:

1. Prepend a column of **1s** to the feature matrix **X** to account for the intercept term (**β0**).
2. Compute the transpose of the padded matrix (**XT**).
3. Compute **XTX**.
4. Compute the inverse of **XTX**.
5. Compute **XTy**.
6. Compute the coefficient vector:

   **β = (XTX)−1XTy**

Return the coefficient vector **β**.

**Input**

The first line contains an integer N, the number of training samples and total number of feature M.
Each of the next N lines contains M feature values followed by the target value.
The first M values represent the feature vector, and the last value represents the target variable.
The number of features M is determined automatically from the input.
First input line contain the number of rows and the total features: Here "5 is number of rows" and 2 is "Number of features X". First n-1 column are the "X features" The last column is the "Target Y".

**Output**

Print the regression coefficients (including the intercept) as a NumPy array rounded to 2 decimal places.

**Example**

### Sample Input:

```

5 2
3 98 60
1 81 44
5 100 51
4 85 55
2 70 40
```

**Explanation:**

First input line contain the number of rows and the total features: Here 5 is number of rows and 2 is "Number of features X". The last column is the "Target Y"

Each row contains:

`Feature1 Feature2 Target`

For example,

`3 98 60` means:

- Feature 1 = 3
- Feature 2 = 98
- Target = 60

### Sample Output:

```

[6.62 0.31 0.49]
```

**Explanation:**

The returned coefficient vector is:

**[β0  β1  β2]**

- **β0 = 6.62** → Intercept
- **β1 = 0.31** → Coefficient of Feature 1
- **β2 = 0.49** → Coefficient of Feature 2

**Constraints**

**Constraints:**

- `1 ≤ X.shape[0] ≤ 104` (Number of properties)
- `1 ≤ X.shape[1] ≤ 20` (Number of features)
- `X.shape[0] == len(y)`
- The matrix `XTX` is guaranteed to be full rank and invertible.
- You may use `numpy` for matrix operations (e.g., `np.hstack`, `np.linalg.inv`, etc.), but you must not use machine learning libraries such as `scikit-learn` or `statsmodels`.


#### Evaluate a Linear Regression Model
_Coding · Hard · Attempted · 0/40 pts_

You are given two arrays representing a dataset:

- `y_true[i]` denotes the actual value of the *i-th* observation.
- `y_pred[i]` denotes the predicted value of the *i-th* observation generated by a regression model.

Your task is to evaluate the regression model by computing the following metrics:

**Mean Absolute Error (MAE)**

**MAE =  1 n    ∑i=1n |yi − ŷi|**

**Mean Squared Error (MSE)**

**MSE =  1 n    ∑i=1n (yi − ŷi)2**

where:

- **yi** is the actual value.
- **ŷi** is the predicted value.
- **n** is the total number of observations.

Return both **MAE** and **MSE**, rounded to **2 decimal places**.

**Input**

The first line contains an integer n, the number of observations.
The second line contains n space-separated real numbers representing the array y\_true.
The third line contains n space-separated real numbers representing the array y\_pred.

**Output**

Print two space-separated numbers: MAE MSE. rounded to 2 decimal places.

**Example**

Input:
5
2 4 5 4 5
2.8 3.4 4.0 4.6 5.2
output:
0.64 0.48

**Constraints**

1 ≤ n ≤ 10^5
len(y\_true) = len(y\_pred) = n
-10^6 ≤ y\_true[i], y\_pred[i] ≤ 10^6


#### MLR on student data
_Notebook (Newton Box) · Hard · Attempted · 0/40 pts_

###### Student Performance Prediction

A teacher collected data about students' study habits and wants to predict their **Exam Score** using Multiple Linear Regression.

The dataset contains the following features:

- **Study\_Hours** – Average study hours per day
- **Attendance** – Attendance percentage
- **Assignments** – Number of assignments completed
- **Exam\_Score** – Final exam score (Target)

One value in the dataset is missing.

###### Tasks

1. Display the first **5 rows** of the dataset.
2. Check whether the dataset contains any missing values.
3. Replace the missing value using the **mean** of that column.
4. Plot a **scatter plot** between **Study\_Hours** and **Exam\_Score**.
5. Plot a **histogram** of **Attendance**.
6. Train a **Multiple Linear Regression** model using:
   - Features: `Study_Hours`, `Attendance`, `Assignments`
   - Target: `Exam_Score`
7. Print:
   - Model Intercept (rounded to 2 decimal places)
   - Model Coefficients (rounded to 2 decimal places)
8. Predict the exam score for a student with:
   - Study Hours = **8**
   - Attendance = **90**
   - Assignments = **10**
9. Print the predicted score rounded to **2 decimal places**.



### Stochastic Gradient Descent, Mini-batch Gradient Descent, Evaluation Metrics, Re ... - In Class — 02 Sep 2026

#### SGD
_Coding · Easy · Attempted · 0/20 pts_

###### Stochastic Gradient Descent (SGD) for Linear Regression

In this problem, you will implement a simplified version of **Stochastic Gradient Descent (SGD)**.

The model contains only a weight **w**. The bias term is fixed at **0**.

**Model:** y = w × x

![Gradient Descent Animation](https://baptiste-monpezat.github.io/4e5a14da749976ec2770eaded04098d4/gradient_descent.gif)  
Visualization of gradient descent moving toward a better solution.

###### What You Need to Implement

Starting with **w = 0**, train the model for the given number of epochs. At the beginning of each epoch, shuffle the training examples before processing them.

To ensure that everyone gets the same result, use the following rule:

Set the random seed to **42** before every shuffle.

**Algorithm:**

1. Initialize `w = 0`.
2. **Set** the random seed to 42 using numpy.
3. For each epoch (repeat `epochs` times):
   - Create an array of indices `[0, 1, 2, ..., N-1]`.
   - Shuffle the indices **in-place** using `shuffle function from` `np.random`.
   - For each index `i` in the shuffled order:
     - Compute the prediction: `prediction = w × X[i]`
     - Compute the gradient: `dw = 2 × (prediction − Y[i]) × X[i]`
     - Update the weight immediately: `w = w − learning_rate × dw`
4. After all epochs are complete, return `w` rounded to 2 decimal places.

###

**Input**

The first line contains an integer N, representing the number of data points.
The next N lines each contain two space-separated numbers x and y.
x represents the input feature.
y represents the target value.
The next line contains a floating point number learning\_rate.
The last line contains an integer epochs, representing the number of times the dataset should be processed.

**Output**

Print the final value of w and b after completing all SGD updates.
Print both values separated by a single space.
Round both values to 2 decimal places.

**Example**

Example 1:
Input:
10
1 0.5
2 1
3 1.5
4 2
5 2.5
6 3
7 3.5
8 4
9 4.5
10 5
0.001
500
Output:
0.5
Example 2:
Input:
3
1 2
2 4
3 6
0.001
100
Output:
1.88

**Constraints**

1 <= N <= 10^4
1 <= epochs <= 10^3
-1000 <= x, y <= 1000
0 < learning\_rate <= 1


### Stochastic Gradient Descent, Mini-batch Gradient Descent - Post Class — 02 Sep 2026

#### Mini-Batch Gradient Descent for Linear Regression
_Coding · Easy · Attempted · 0/20 pts_

In this problem, you will implement a simplified version of Mini-Batch Gradient Descent.  
The model contains only a weight `w`. The bias term is fixed at 0.  
Model: `y = w × x`  
  
Starting with `w = 0`, train the model for the given number of epochs. At the beginning of each epoch, shuffle the training examples before splitting them into mini-batches.

**Algorithm**:

```

1. Initialize w = 0.
2. Set the random seed to 42 using numpy.
3. For each epoch (repeat `epochs` times):
     * Create an array of indices [0, 1, 2, ..., N-1].
     * Shuffle the indices in-place using the shuffle function from np.random.
     * Split the shuffled indices into consecutive groups of size `batch_size`.
       (If N is not evenly divisible by batch_size, the last group is simply smaller.)
     * For each group of indices:
          * For every index i in the group, compute its gradient contribution:
              prediction = w × X[i]
              grad_i = 2 × (prediction − Y[i]) × X[i]
          * Average the gradients of just this group:
              dw = (sum of grad_i in this group) / (number of indices in this group)
          * Update the weight ONCE for this group:
              w = w − learning_rate × dw
3. After all epochs are complete, return w rounded to 2 decimal places.
```

```

Note how this generalizes the other two: batch_size = 1 makes every group a single sample, which is exactly SGD. batch_size = N makes there be only one group containing everything, which is exactly Batch GD.
```

**Input**

The first line contains an integer N, representing the number of data points.
The next N lines each contain two space-separated numbers x and y.
x represents the input feature.
y represents the target value.
The next line contains a floating point number learning\_rate.
The next line contains an integer batch\_size.
The last line contains an integer epochs, representing the number of times the dataset should be processed.

**Output**

Print the final value of w after completing all Mini-Batch Gradient Descent updates, rounded to 2 decimal places.

**Example**

Input:
10
1 0.5
2 1
3 1.5
4 2
5 2.5
6 3
7 3.5
8 4
9 4.5
10 5
0.001
2
500
Output:
0.5

**Constraints**

1 <= N <= 10^4
1 <= batch\_size <= N
1 <= epochs <= 10^3
-1000 <= x, y <= 1000
0 < learning\_rate <= 1


### Evaluation Metrics, Regression Metrics, Mean Absolute Error (MAE), Mean Absolute ... - In Class — 07 Sep 2026

#### Regression Error Metrics R2
_Coding · Easy · Solved ✓ · 20/20 pts_

In regression analysis, evaluating how well a model explains the variability in the target variable is just as important as measuring prediction errors.  
Given two arrays:

- actual: the true target values
- predicted: the predicted target values

compute the following  metrics:

1. **R² (Coefficient of Determination)**
2. **Adjusted R²**

The metrics are defined as follows:  
**Compute the Residual Sum of Squares (RSS)**

<inlineMath>RSS=\sum\_{i=1}^{n}(y\_i-\hat{y}\_i)^2</inlineMath>

where

- <inlineMath>y\_i</inlineMath> is the actual value.
- <inlineMath>\hat{y}\_i</inlineMath> is the predicted value.

###### **Compute the Total Sum of Squares (TSS)**

First compute the mean of the actual values.

<inlineMath>\bar{y}=\frac{1}{n}\sum\_{i=1}^{n}y\_i</inlineMath>

Then,

<inlineMath>TSS=\sum\_{i=1}^{n}(y\_i-\bar{y})^2</inlineMath>

###### **Compute R²**

<inlineMath>R^2=1-\frac{RSS}{TSS}</inlineMath>

Special Case:

- If <inlineMath>TSS=0</inlineMath>, return **None** for both metrics.

###### **Compute Adjusted R²**

Given the number of predictor variables <inlineMath>p</inlineMath>,

<inlineMath>Adjusted;R^2=1-\left(\frac{(1-R^2)(n-1)}{n-p-1}\right)</inlineMath>

If  <inlineMath>n-p-1\le0</inlineMath>.  return **None** for Adjusted R².  
Round every numeric answer to **2 decimal places**.

**Input**

The input consists of:
First line contains an integer n, the number of observations.
Second line contains n space-separated actual values.
Third line contains n space-separated predicted values.
Fourth line contains an integer p, the number of predictor variables.

**Output**

Print two values separated by a space in the following order:
R² Adjusted\_R²
If TSS = 0, print
None None
If Adjusted R² cannot be computed because n-p-1\le0
print
R² None

**Example**

input:
5
3 5 7 9 11
2.8 5.3 6.8 9.2 10.9
1
output:
0.99 0.99

**Constraints**

1\le n\le10^5
1\le p\le100
Both arrays have equal length.
Values may be integers or floating-point numbers.
Time Complexity: O(n)
Auxiliary Space: O(1)

**My solution** (Python (3.12.7) for ML)

```python
# def regression_goodness_of_fit(actual, predicted, p):
#     n = len(actual)

#     if n != len(predicted):
#         raise ValueError("Input arrays must have equal length.")

#     # Mean of actual values
#      #write your code here 
#     mean_actual = sum(actual) / n
#     # Compute RSS and TSS
#     rss = 0.0
#     tss = 0.0

#     for a, pred in zip(actual, predicted):
#         #write your code here 
#     # If TSS is zero, R² is undefined
#         rss += (a-pred) ** 2
#         tss += (a-mean_actual) ** 2
#     if tss == 0:
#         return None, None                                                           #write your code here 

#     # Compute R²
#     #write your code here 
#     r2 = round(1-(rss/tss),2)

#     # Compute Adjusted R²
#     #write your code here
#     if n - p - 1 <= 0:
#         adjusted_r2 = None 
#     else:
#         raw_adj_r2 = 1 - ((1 - (rss/tss)) * (n-1) / (n-p-1))
#         adjusted_r2 = raw_adj_r2

#     if adjusted_r2 is not None:
#         adjusted_r2 = round(adjusted_r2, 2)

#     return r2, adjusted_r2
def regression_goodness_of_fit(actual, predicted, p):
    n = len(actual)

    if n != len(predicted):
        raise ValueError("Input arrays must have equal length.")

    # Mean of actual values
    mean_actual = sum(actual) / n

    # Compute RSS and TSS
    rss = 0.0
    tss = 0.0

    for a, pred in zip(actual, predicted):
        rss += (a - pred) ** 2
        tss += (a - mean_actual) ** 2

    # If TSS is zero, R² is undefined
    if tss == 0:
        return None, None

    # Compute R²
    r2_val = 1 - (rss / tss)
    r2 = round(r2_val, 2)

    # Compute Adjusted R²
    if n - p - 1 <= 0:
        adjusted_r2 = None
    else:
        # Standard Adjusted R2 formula: 1 - [(1 - R2) * (n - 1) / (n - p - 1)]
        adj_val = 1 - ((1 - r2_val) * (n - 1) / (n - p - 1))
        adjusted_r2 = round(adj_val, 2)

    return r2, adjusted_r2
```


### Evaluation Metrics, Regression Metrics, Mean Absolute Error (MAE), Mean Absolute ... - Post Class — 07 Sep 2026

#### Regression Error Metrics Calculator
_Coding · Easy · Attempted · 0/20 pts_

A Machine Learning engineer has trained a regression model to predict students' final examination marks. Before deploying the model, the engineer needs to evaluate how well the model performs on unseen data.  
Your task is to implement a function that computes the following four widely used regression evaluation metrics:

- Mean Absolute Error (MAE)
- Mean Squared Error (MSE)
- Root Mean Squared Error (RMSE)
- Mean Absolute Percentage Error (MAPE)

Each metric measures prediction error differently. Together, they provide a comprehensive assessment of a regression model's performance.  
Implement the function according to the mathematical definitions provided below.  
**Mathematical Definitions**  
Let <inlineMath>n</inlineMath> be the number of observations.  
Let <inlineMath>y\_i</inlineMath> be the actual value of the <inlineMath>i^{th}</inlineMath> observation.  
Let <inlineMath>\hat{y}\_i</inlineMath> be the predicted value of the <inlineMath>i^{th}</inlineMath> observation.  
**Mean Absolute Error (MAE)**  
Mean Absolute Error (MAE) measures the average magnitude of prediction errors without considering their direction.

<inlineMath>MAE=\frac{1}{n}\sum\_{i=1}^{n}\left|y\_i-\hat{y}\_i\right|</inlineMath>

  Interpretation

- Lower MAE indicates better prediction accuracy.
- MAE is expressed in the same unit as the target variable.

**Mean Squared Error (MSE)**  
Mean Squared Error (MSE) squares every prediction error before averaging.

<inlineMath>MSE=\frac{1}{n}\sum\_{i=1}^{n}\left(y\_i-\hat{y}\_i\right)^2</inlineMath>

 Interpretation

- Large prediction errors receive significantly larger penalties than smaller errors.
- MSE is commonly used as the optimization objective for many regression algorithms.

**Root Mean Squared Error (RMSE)**  
Root Mean Squared Error (RMSE) is the square root of the Mean Squared Error.

<inlineMath>RMSE=(MSE)^{1/2}</inlineMath>

  Interpretation

- RMSE is expressed in the original unit of the target variable.
- It retains the large-error sensitivity of MSE.

**Mean Absolute Percentage Error (MAPE)**  
For each observation, the Absolute Percentage Error (APE) is defined as

<inlineMath>APE\_i=\frac{\left|y\_i-\hat{y}\_i\right|}{\left|y\_i\right|}\times100</inlineMath>

The Mean Absolute Percentage Error (MAPE) is computed as

<inlineMath>MAPE=\frac{1}{k}\sum\_{i=1}^{k}APE\_i</inlineMath>

where  
<inlineMath>k</inlineMath> represents the number of observations whose actual value is not equal to <inlineMath>0</inlineMath>.  
Since division by zero is undefined, observations whose actual value is equal to <inlineMath>0</inlineMath> must not be included while computing MAPE.

**Input**

The input format would be:
n is the number of observations.
The second line contains n space-separated actual values.
The third line contains n space-separated predicted values.

**Output**

Return four values in the following order seprated by space :
MAE MSE RMSE MAPE
where
The first value represents the Mean Absolute Error (MAE).
The second value represents the Mean Squared Error (MSE).
The third value represents the Root Mean Squared Error (RMSE).
The fourth value represents the Mean Absolute Percentage Error (MAPE).

**Example**

Input:
5
40 50 60 70 80
45 52 58 72 78
output :
2.60 8.20 2.86 5.04

**Constraints**

1 \le n \le 10^5, where n is the number of observations.
\texttt{len(actual)}=\texttt{len(predicted)}=n.
Each element in ,actual and predicted may be an integer or a floating-point number.
Each value satisfies -10^6 \le \text{value} \le 10^6.
Actual values may contain one or more zeros. While computing MAPE, observations having actual value equal to 0 should be ignored.


### Model Tuning, Population True Function, White noise, Irreducible Error, Model Es ... - In Class — 14 Sep 2026

#### Regression Analysis and Polynomial regression
_Notebook (Newton Box) · Medium · Attempted · 0/20 pts_

The relationship between temperature and ice cream sales is often nonlinear. Your task is to investigate this by:

1. Training a **Linear Regression** model.
2. Training a **Polynomial Regression (Degree = 2)** model.
3. Comparing both models using **R² Score** and **Mean Squared Error (MSE)**.
4. Determining which model provides a better fit for the data.
5. Explaining why Polynomial Regression outperforms Linear Regression for this dataset.



#### Polynomial Regression Detective with Shinchan
_Coding · Hard · Attempted · 0/40 pts_

Shinchan Nohara loves exploring the world around him. One sunny afternoon, he notices that the number of ants visiting his backyard seems to change with the temperature. He decides to become a “Data Detective” and records pairs of data: **temperature (X)** and **ant count (y)** . He collects measurements on multiple days and splits them into a training set and a testing set.

Shinchan wants to find a mathematical model that can predict ant counts from temperature. He thinks polynomial curves of different degrees might fit the data. He asks you to help him with the following tasks:

- For each polynomial degree in a given list (e.g., 1, 3, 5, 10), fit a polynomial regression model on the training data.
- Compute the **Mean Squared Error (MSE)** on both the training and testing sets.
- Determine which degree gives the **best generalization** – the one with the **lowest test MSE** (if there is a tie, choose the smallest degree).
- Classify each model as:

  - **Underfitting** – if both training and test MSEs are high (> 0.3) and they are very close (difference < 0.05).
  - **Overfitting** – if the training MSE is very low (< 0.1) but the test MSE is high (> 0.15).
  - **Good** – otherwise.

Your task is to write a Python function that performs this analysis and returns the results in a specific format. Shinchan is counting on you!

##### Note-1: Classification Rules

Apply the following rules **in order** for each polynomial degree, using the **unrounded** MSE values:

###### Underfitting

```

train_mse > 0.3 and test_mse > 0.3 and abs(train_mse - test_mse) < 0.05
```

###### Overfitting (if not underfit)

```

train_mse < 0.1 and test_mse > 0.15
```

###### Good

Otherwise.

##### Note 2: Best Degree Rule

The best polynomial degree is the one with the **smallest unrounded test MSE**.  
If multiple degrees have the same test MSE (within floating‑point precision), choose the **smallest degree**.

Equivalent logic:

```

best_idx = min(
    range(len(raw_test_mses)),
    key=lambda i: (raw_test_mses[i], degrees[i])
)
best_degree = degrees[best_idx]
```

**Input**

The input is provided through standard input (stdin) as a single JSON object.
The JSON object contains the following keys:
"X\_train": a list of lists, where each inner list contains one numeric feature value.
"y\_train": a list of numeric target values corresponding to X\_train.
"X\_test": a list of lists with the same structure as X\_train.
"y\_test": a list of numeric target values corresponding to X\_test.
"degrees": a list of integer polynomial degrees to evaluate.

**Output**

Your function must return a Python dictionary containing the following keys:
"best\_degree": integer — the degree with the minimum actual test MSE.
"train\_mses": list of floats — the training MSE for each degree, rounded to 4 decimal places, in the same order as degrees.
"test\_mses": list of floats — the testing MSE for each degree, rounded to 4 decimal places, in the same order as degrees.
"classifications": list of strings — "underfit", "overfit", or "good" for each degree, in the same order as degrees.
The returned dictionary is converted to JSON and printed to stdout by the provided post‑function code.

**Example**

Input (sinusoidal data, degrees [1, 3, 5, 10]):
{
"X\_train": [[-2.0], [-1.5], [-1.0], [-0.5], [0.0], [0.5], [1.0], [1.5], [2.0]],
"y\_train": [-0.9093, -0.9975, -0.8415, -0.4794, 0.0, 0.4794, 0.8415, 0.9975, 0.9093],
"X\_test": [[-1.75], [-0.75], [0.25], [1.25], [1.75]],
"y\_test": [-0.9840, -0.6816, 0.2474, 0.9490, 0.9840],
"degrees": [1, 3, 5, 10]
}
Expected Output:
{
"best\_degree": 3,
"train\_mses": [0.4562, 0.0653, 0.0241, 0.0038],
"test\_mses": [0.4398, 0.0711, 0.0895, 0.2136],
"classifications": ["underfit", "good", "good", "overfit"]
}
Explanation
Degree 1: train=0.4562, test=0.4398, both >0.3, diff=0.0164 <0.05 → underfit.
Degree 3: lowest test MSE (0.0711) → best\_degree=3, classified as good.
Degree 5: test MSE 0.0895, not overfit → good.
Degree 10: train=0.0038 <0.1, test=0.2136 >0.15 → overfit.

**Constraints**

5 <= n\_train <= 500
4 <= n\_test <= 200
2 <= len(degrees) <= 6
1 <= degree <= 15
Each element of X\_train and X\_test contains exactly one numeric feature.
Feature values and target values are within [-10, 10].
Returned MSE values must be rounded to 4 decimal places.


### Model Tuning, Population True Function, White noise, Irreducible Error, Model Es ... - Post Class — 14 Sep 2026

#### Bias-Variance Tradeoff
_Notebook (Newton Box) · Medium · Attempted · 0/20 pts_

A synthetic dataset has been created. Implement a machine learning model (linear regression) on this dataset. Analyse the mse\_train and mse\_test values and infer whether it is case of underfitting or overfitting.



#### High variance
_Notebook (Newton Box) · Medium · Attempted · 0/20 pts_

A company aims to develop a predictive model to forecast customer spending based on their age. To achieve this, they decide to employ a polynomial regression model with a high degree (e.g., degree 10 or higher). While this approach allows for capturing intricate relationships in the data, it also leads to overfitting, where the model learns not only the underlying patterns but also the noise present in the training dataset.  
  
To effectively demonstrate this scenario, the following steps will be undertaken:  
Model Implementation: Fit polynomial regression models of varying degrees, particularly focusing on a high-degree polynomial to illustrate overfitting.  
Visualization: Generate visualizations that depict:  
The training data points along with the fitted polynomial curve.  
The model's predictions on both the training and test datasets  
Metrics such as Mean Squared Error (MSE) and R² for both training and test sets to quantitatively assess the degree of overfitting.



### Feature Extraction, Principal Component Analysis (PCA), Orthogonality, Covarianc ... - In Class — 21 Sep 2026

#### PCA Implementation from scratch
_Coding · Hard · Attempted · 0/40 pts_

You are given a dataset with `n` samples and `m` features. Use PCA to shrink the dataset into fewer dimensions. Then, keep the top *k* eigenvectors, which represent the most important patterns in the data, and return the data projected onto those *k* dimensions.

###### PCA Steps to Implement

1. Standardise the data using StandardScaler.
2. Compute the covariance matrix of the Standardised data.
3. Find the top `k` eigenvectors of the covariance matrix corresponding to the largest eigenvalues.
4. Project the data onto these `k` eigenvectors.

**Input**

First line: three integers n m k
n = number of rows (samples)
m = number of columns (features)
k = number of principal components to retain
Next n lines: each line contains m space-separated floats representing a row of the dataset.

**Output**

n lines, each containing k space-separated floats (rounded to 4 decimal places).

**Example**

**Input** 
10 2 1
2.5 2.4
0.5 0.7
2.2 2.9
1.9 2.2
3.1 3.0
2.3 2.7
2.0 1.6
1.0 1.1
1.5 1.6
1.1 0.9
 **Output** 
1.0864
-2.3089
1.2419
0.3408
2.1843
1.1607
-0.0926
-1.4821
-0.5672
-1.5633

**Constraints**

1 ≤ n ≤ 200
1 ≤ m ≤ 50
1 ≤ k ≤ m


### Feature Extraction, Principal Component Analysis (PCA), Orthogonality, Covarianc ... - Post Class — 21 Sep 2026

#### PCA variance
_Notebook (Newton Box) · Hard · Attempted · 0/40 pts_

You are given a dataset, scaled using StandardScaler. Your task is to implement the function get\_n\_components(X) that determines the optimal number of principal components needed to explain at least 96% of the variance in the dataset using PCA.



### Scree Plot, Regularization, Ridge Regression, Lasso Regression, Data Sparsity - In Class — 28 Sep 2026

#### Regularization
_Notebook (Newton Box) · Easy · Attempted · 0/20 pts_

Implement L1 (Lasso) and L2 (Ridge) regularization techniques using scikit-learn. Tune the regularization parameter and observe its effect on the model's performance.



### Time Series Modelling, Time Series Data, Time Series Components, Trend, Seasonal ... - In Class — 30 Sep 2026

#### Logistic Forcasting Problem
_Notebook (Newton Box) · Medium · Solved ✓ · 20/20 pts_

Scenario: Forecast Readiness Assessment  
  
You are working as a junior data analyst in a logistics company.  
  
Before building forecasting models, your team asks a critical question:

- Does the data contain enough predictable structure (trend or seasonality),

            or is it dominated by noise?  
  
Your task is to **numerically evaluate** whether forecasting this time series is  
**meaningful or risky**.  
  
You must justify your answer using **decomposition and variance analysis**.  
  
**Objective**  
  
1. Decompose the given time series into:  
   - Trend  
   - Seasonality  
   - Noise  
2. Quantify how much variance is explained by signal (trend + seasonality).  
3. Decide whether the data is:  
   - Forecast-friendly  
   - Or noise-dominated

_Solved in Newton Box — your notebook code stays on Newton (not exportable)._


#### Time Series Forecasting
_Coding · Medium · Attempted · 0/20 pts_

A public health department monitors the monthly demand for a vaccine across the city. Historical records indicate that vaccine demand has gradually increased over time due to population growth and expanded immunization programs. Analysts have confirmed that the historical data does not exhibit any recurring seasonal behaviour.  
To ensure uninterrupted vaccine availability, the department plans to maintain a safety stock of 10% above the expected demand for each of the next three months.  
Using the historical vaccine demand data, develop an appropriate forecasting solution to estimate the demand for the next three months. Based on the forecast, calculate the recommended stock level by adding 10% to each predicted demand.  
Return a DataFrame containing the forecasted demand and the recommended stock quantity for each month. Round all numeric values to two decimal places.

**Input**

A JSON object representing monthly vaccine demand.
{"Demand":[2500,2530,2565,2600,2635,2675,2710,2745,2780,2820,2855,2890]}

**Output**

Forecast,Recommended\_Stock
2918.42,3210.26
2947.53,3242.28
2975.61,3273.17

**Example**

<>Input<>
{"Demand":[2500,2530,2565,2600,2635,2675,2710,2745,2780,2820,2855,2890]}
<>Output<>
Forecast,Recommended\_Stock
2918.42,3210.26
2947.53,3242.28
2975.61,3273.17

**Constraints**

The dataset contains at least 12 monthly observations.
Demand contains numeric values only.
Forecast exactly 3 future observations.
Recommended stock = Forecast × 1.10.
Return a DataFrame containing:Forecast, Recommended\_Stock
Round all values to 2 decimal places.


### Time Series Modelling, Time Series Data, Time Series Components, Trend, Seasonal ... - Post Class — 30 Sep 2026

#### Trends,
_Notebook (Newton Box) · Easy · Attempted · 0/20 pts_

You are given a time series that contains:

- A long-term **trend**
- A repeating **seasonal pattern**
- Random **noise**

Your task is **not just to visualize**, but to **numerically verify**:

**How much of the variation in the data is explained by trend and seasonality combined?**

###### Objective

Compute the **percentage of total variance explained by (Trend + Seasonality)**



#### Seasonal pattern
_Notebook (Newton Box) · Easy · Attempted · 0/20 pts_

**You are given a time series that contains:**

- A weak long-term trend
- A strong repeating seasonal pattern
- A moderate amount of noise

  
**Your task is to determine numerically:**  
  
    Does seasonality explain more variation than trend?


