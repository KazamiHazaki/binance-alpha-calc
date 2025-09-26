## 📊 Binance Alpha Points Calculator: Overview

This document outlines the features and functionality of a **simple, lightweight, and stateless web application** designed to help users **calculate and estimate** their potential **Binance Alpha Points** based on daily trading volume. This tool is for informational purposes only, assisting with strategy.

---

## 💻 How to Use the Calculator

The calculator is straightforward and requires **no setup**.

1.  **Open `index.html`** in your web browser.
2.  **Enter Daily Trading Volume:** Type the amount of money (in **USD**) you plan to trade each day into the first input field.
3.  **Select Multiplier:** Choose the volume multiplier for the current event (**from 1x to 4x**) from the dropdown menu.
4.  **Click Calculate:** Press the **"Calculate Points"** button to view your results.

### **Instant Results Display**

The application will instantly display:

* Your estimated **volume points earned per day**.
* Your **total estimated points** over a **15-day period**.
* A clear explanation of **how these numbers were calculated**.

---

## 🧪 The Calculation Formula

The calculation for volume points follows a **logarithmic scale**, which rewards higher volumes with progressively more points.

### **Core Formula**

$$\text{Points} = \text{floor}\left(\log_2\left(\frac{\text{Effective Volume}}{2}\right)\right) + 1$$

### **Definitions**

* **Effective Volume:** $\text{Your Daily Volume} \times \text{Selected Multiplier}$.
* $\log_2$: The **logarithm to the base 2**.
* $\text{floor}$: Rounds the result **down to the nearest whole number**.

### **Minimum Volume Requirement**

A minimum effective volume of **\$2** is required to start earning points. If your effective volume is less than \$2, you earn **0 points**.

### **Example Calculation**

| Parameter | Value |
| :--- | :--- |
| **Daily Volume** | \$10,000 |
| **Multiplier** | 2x |
| **Effective Volume** | $\$10,000 \times 2 = \$20,000$ |

**Calculation Steps:**

1.  $\text{Points} = \text{floor}(\log_2(20000 / 2)) + 1$
2.  $\text{Points} = \text{floor}(\log_2(10000)) + 1$
3.  $\text{Points} = \text{floor}(13.28) + 1$
4.  $\text{Points} = 13 + 1 = 14$ **points per day.**

---

## 🐳 Containerization and Deployment

This application is built to be **stateless** and requires **no backend or database**, making it an ideal candidate for **containerization**.

* **Serving:** You can serve the `index.html` file using any static web server, such as **Nginx**, **Caddy**, or a simple **Python server**.
* **Configuration:** **No environment variables** are needed for the app to run. The included `.env-example` file is solely a placeholder for compatibility with deployment pipelines that may expect one.
