# RideWise-BikeDemandPrediction
Predicting bike-sharing demand using ML and weather/event data

# Load libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
# Display the number of rows and columns
print("Shape of day_df:", day_df.shape)
print("Shape of hour_df:", hour_df.shape)
# Find null values
print("Null values in day_df:")
print(day_df.isnull().sum())

print("\nNull values in hour_df:")
print(hour_df.isnull().sum())

# Find duplicate values
print("\nDuplicate rows in day_df:", day_df.duplicated().sum())
print("Duplicate rows in hour_df:", hour_df.duplicated().sum())
# Univariate Analysis for day_df
fig, axes = plt.subplots(1, 3, figsize=(15, 5))
sns.histplot(day_df['cnt'], ax=axes[0], kde=True)
axes[0].set_title('Distribution of Total Rentals (day_df)')

sns.histplot(day_df['temp'], ax=axes[1], kde=True)
axes[1].set_title('Distribution of Temperature (day_df)')

sns.histplot(day_df['hum'], ax=axes[2], kde=True)
axes[2].set_title('Distribution of Humidity (day_df)')

plt.tight_layout()
plt.show()
# Bivariate Analysis for day_df
plt.figure(figsize=(10, 6))
sns.scatterplot(x='temp', y='cnt', data=day_df)
plt.title('Relationship between Temperature and Total Rentals (day_df)')
plt.xlabel('Temperature (Normalized)')
plt.ylabel('Total Rentals')
plt.show()

plt.figure(figsize=(10, 6))
sns.scatterplot(x='hum', y='cnt', data=day_df)
plt.title('Relationship between Humidity and Total Rentals (day_df)')
plt.xlabel('Humidity (Normalized)')
plt.ylabel('Total Rentals')
plt.show()
# Multivariate Analysis - Correlation Heatmap for day_df
plt.figure(figsize=(12, 8))
sns.heatmap(day_df.drop(['dteday', 'instant'], axis=1).corr(), annot=True, cmap='coolwarm', fmt=".2f")
plt.title('Correlation Matrix for day_df')
plt.show()
# Univariate Analysis for hour_df
fig, axes = plt.subplots(1, 3, figsize=(15, 5))

sns.histplot(hour_df['cnt'], ax=axes[0], kde=True)
axes[0].set_title('Distribution of Total Rentals (hour_df)')

sns.histplot(hour_df['temp'], ax=axes[1], kde=True)
axes[1].set_title('Distribution of Temperature (hour_df)')

sns.histplot(hour_df['hum'], ax=axes[2], kde=True)
axes[2].set_title('Distribution of Humidity (hour_df)')

plt.tight_layout()
plt.show()
# Bivariate Analysis for hour_df
plt.figure(figsize=(10, 6))
sns.scatterplot(x='temp', y='cnt', data=hour_df)
plt.title('Relationship between Temperature and Total Rentals (hour_df)')
plt.xlabel('Temperature (Normalized)')
plt.ylabel('Total Rentals')
plt.show()

plt.figure(figsize=(10, 6))
sns.scatterplot(x='hum', y='cnt', data=hour_df)
plt.title('Relationship between Humidity and Total Rentals (hour_df)')
plt.xlabel('Humidity (Normalized)')
plt.ylabel('Total Rentals')
plt.show()

plt.figure(figsize=(10, 6))
sns.scatterplot(x='temp', y='hum', data=hour_df)
plt.title('Relationship between Temperature and Humidity (hour_df)')
plt.xlabel('Temperature (Normalized)')
plt.ylabel('Humidity (Normalized)')
plt.show()
# Multivariate Analysis - Correlation Heatmap for hour_df
plt.figure(figsize=(12, 8))
sns.heatmap(hour_df.drop(['dteday', 'instant'], axis=1).corr(), annot=True, cmap='coolwarm', fmt=".2f")
plt.title('Correlation Matrix for hour_df')
plt.show()

from sklearn.metrics import mean_squared_error, r2_score

# Evaluate models on the day dataset
mse_lr_day = mean_squared_error(y_test_day, y_pred_lr_day)
r2_lr_day = r2_score(y_test_day, y_pred_lr_day)

mse_dt_day = mean_squared_error(y_test_day, y_pred_dt_day)
r2_dt_day = r2_score(y_test_day, y_pred_dt_day)

mse_rf_day = mean_squared_error(y_test_day, y_pred_rf_day)
r2_rf_day = r2_score(y_test_day, y_pred_rf_day)

print("Evaluation Metrics for Day Dataset:")
print(f"  Linear Regression - MSE: {mse_lr_day:.2f}, R-squared: {r2_lr_day:.2f}")
print(f"  Decision Tree Regressor - MSE: {mse_dt_day:.2f}, R-squared: {r2_dt_day:.2f}")
print(f"  Random Forest Regressor - MSE: {mse_rf_day:.2f}, R-squared: {r2_rf_day:.2f}")

# Evaluate models on the hour dataset
mse_lr_hour = mean_squared_error(y_test_hour, y_pred_lr_hour)
r2_lr_hour = r2_score(y_test_hour, y_pred_lr_hour)

mse_dt_hour = mean_squared_error(y_test_hour, y_pred_dt_hour)
r2_dt_hour = r2_score(y_test_hour, y_pred_dt_hour)

mse_rf_hour = mean_squared_error(y_test_hour, y_pred_rf_hour)
r2_rf_hour = r2_score(y_test_hour, y_pred_rf_hour)

print("\nEvaluation Metrics for Hour Dataset:")
print(f"  Linear Regression - MSE: {mse_lr_hour:.2f}, R-squared: {r2_lr_hour:.2f}")
print(f"  Decision Tree Regressor - MSE: {mse_dt_hour:.2f}, R-squared: {r2_dt_hour:.2f}")
print(f"  Random Forest Regressor - MSE: {r2_rf_hour:.2f}, R-squared: {r2_rf_hour:.2f}")



import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

# Load the datasets (assuming they are in the correct paths)
try:
    day_df = pd.read_csv("/content/day.csv")
    hour_df = pd.read_csv("/content/hour.csv")
except FileNotFoundError:
    print("Error: Make sure 'day.csv' and 'hour.csv' are uploaded to the '/content/' directory.")
    # Exit or handle the error appropriately if files are not found
    exit() # Exiting for now, you might want a different error handling

# Convert 'dteday' to datetime objects
day_df['dteday'] = pd.to_datetime(day_df['dteday'])
hour_df['dteday'] = pd.to_datetime(hour_df['dteday'])

# Extract time-based features from 'dteday' in day_df
day_df['year'] = day_df['dteday'].dt.year
day_df['month'] = day_df['dteday'].dt.month
day_df['dayofweek'] = day_df['dteday'].dt.dayofweek
day_df['dayofyear'] = day_df['dteday'].dt.dayofyear

# Extract time-based features from 'dteday' and 'hr' in hour_df
hour_df['year'] = hour_df['dteday'].dt.year
hour_df['month'] = hour_df['dteday'].dt.month
hour_df['dayofweek'] = hour_df['dteday'].dt.dayofweek
hour_df['dayofyear'] = hour_df['dteday'].dt.dayofyear
hour_df['hour'] = hour_df['hr'] # 'hr' column already exists and represents the hour


# Identify categorical columns
categorical_cols_day = ['season', 'weathersit', 'mnth', 'weekday', 'yr'] # Include 'yr' for one-hot encoding
categorical_cols_hour = ['season', 'weathersit', 'mnth', 'weekday', 'hr', 'yr'] # Include 'yr' for one-hot encoding and 'hr'

# Apply one-hot encoding
day_df_encoded = pd.get_dummies(day_df, columns=categorical_cols_day, drop_first=True)
hour_df_encoded = pd.get_dummies(hour_df, columns=categorical_cols_hour, drop_first=True)


# Identify numerical columns to scale (excluding 'cnt', 'instant', and 'dteday')
numerical_cols_day_to_scale = day_df_encoded.select_dtypes(include=np.number).columns.tolist()
numerical_cols_day_to_scale.remove('cnt')
if 'instant' in numerical_cols_day_to_scale:
    numerical_cols_day_to_scale.remove('instant')
if 'casual' in numerical_cols_day_to_scale:
    numerical_cols_day_to_scale.remove('casual')
if 'registered' in numerical_cols_day_to_scale:
    numerical_cols_day_to_scale.remove('registered')


numerical_cols_hour_to_scale = hour_df_encoded.select_dtypes(include=np.number).columns.tolist()
numerical_cols_hour_to_scale.remove('cnt')
if 'instant' in numerical_cols_hour_to_scale:
    numerical_cols_hour_to_scale.remove('instant')
if 'hr' in numerical_cols_hour_to_scale:
    numerical_cols_hour_to_scale.remove('hr') # 'hr' is now part of one-hot encoded features
if 'casual' in numerical_cols_hour_to_scale:
    numerical_cols_hour_to_scale.remove('casual')
if 'registered' in numerical_cols_hour_to_scale:
    numerical_cols_hour_to_scale.remove('registered')


# Instantiate StandardScaler
scaler = StandardScaler()

# Apply scaling to day_df_encoded
day_df_encoded[numerical_cols_day_to_scale] = scaler.fit_transform(day_df_encoded[numerical_cols_day_to_scale])

# Apply scaling to hour_df_encoded
hour_df_encoded[numerical_cols_hour_to_scale] = scaler.fit_transform(hour_df_encoded[numerical_cols_hour_to_scale])


# Define features (X) and target (y) for day_df
X_day_cols = [col for col in day_df_encoded.columns if col not in ['instant', 'dteday', 'casual', 'registered', 'cnt']]
X_day = day_df_encoded[X_day_cols]
y_day = day_df_encoded['cnt']

# Define features (X) and target (y) for hour_df
X_hour_cols = [col for col in hour_df_encoded.columns if col not in ['instant', 'dteday', 'casual', 'registered', 'cnt']]
X_hour = hour_df_encoded[X_hour_cols]
y_hour = hour_df_encoded['cnt']

print("Features and target variables defined for both datasets.")
print("\nShape of X_day:", X_day.shape)
print("Shape of y_day:", y_day.shape)
print("\nShape of X_hour:", X_hour.shape)
print("Shape of y_hour:", y_hour.shape)

# Split day_df into training and testing sets
X_train_day, X_test_day, y_train_day, y_test_day = train_test_split(X_day, y_day, test_size=0.2, random_state=42)

# Split hour_df into training and testing sets
X_train_hour, X_test_hour, y_train_hour, y_test_hour = train_test_split(X_hour, y_hour, test_size=0.2, random_state=42)

# Print the shapes of the resulting sets
print("Shape of X_train_day:", X_train_day.shape)
print("Shape of X_test_day:", X_test_day.shape)
print("Shape of y_train_day:", y_train_day.shape)
print("Shape of y_test_day:", y_test_day.shape)

print("\nShape of X_train_hour:", X_train_hour.shape)
print("Shape of X_test_hour:", X_test_hour.shape)
print("Shape of y_train_hour:", y_train_hour.shape)
print("Shape of y_test_hour:", y_test_hour.shape)

# Instantiate regression models
lr_day = LinearRegression()
dt_day = DecisionTreeRegressor(random_state=42)
rf_day = RandomForestRegressor(random_state=42)

lr_hour = LinearRegression()
dt_hour = DecisionTreeRegressor(random_state=42)
rf_hour = RandomForestRegressor(random_state=42)

# Train models on the day dataset
lr_day.fit(X_train_day, y_train_day)
dt_day.fit(X_train_day, y_train_day)
rf_day.fit(X_train_day, y_train_day)

print("Models trained on day dataset.")

# Train models on the hour dataset
lr_hour.fit(X_train_hour, y_train_hour)
dt_hour.fit(X_train_hour, y_train_hour)
rf_hour.fit(X_train_hour, y_train_hour)

print("Models trained on hour dataset.")

# Make predictions on the testing data
y_pred_lr_day = lr_day.predict(X_test_day)
y_pred_dt_day = dt_day.predict(X_test_day)
y_pred_rf_day = rf_day.predict(X_test_day)

y_pred_lr_hour = lr_hour.predict(X_test_hour)
y_pred_dt_hour = dt_hour.predict(X_test_hour)
y_pred_rf_hour = rf_hour.predict(X_test_hour)

print("Predictions have been made for all models and datasets.")

# Evaluate models on the day dataset
mse_lr_day = mean_squared_error(y_test_day, y_pred_lr_day)
r2_lr_day = r2_score(y_test_day, y_pred_lr_day)

mse_dt_day = mean_squared_error(y_test_day, y_pred_dt_day)
r2_dt_day = r2_score(y_test_day, y_pred_dt_day)

mse_rf_day = mean_squared_error(y_test_day, y_pred_rf_day)
r2_rf_day = r2_score(y_test_day, y_pred_rf_day)

print("Evaluation Metrics for Day Dataset:")
print(f"  Linear Regression - MSE: {mse_lr_day:.2f}, R-squared: {r2_lr_day:.2f}")
print(f"  Decision Tree Regressor - MSE: {mse_dt_day:.2f}, R-squared: {r2_dt_day:.2f}")
print(f"  Random Forest Regressor - MSE: {mse_rf_day:.2f}, R-squared: {r2_rf_day:.2f}")

# Evaluate models on the hour dataset
mse_lr_hour = mean_squared_error(y_test_hour, y_pred_lr_hour)
r2_lr_hour = r2_score(y_test_hour, y_pred_lr_hour)

mse_dt_hour = mean_squared_error(y_test_hour, y_pred_dt_hour)
r2_dt_hour = r2_score(y_test_hour, y_pred_dt_hour)

mse_rf_hour = mean_squared_error(y_test_hour, y_pred_rf_hour)
r2_rf_hour = r2_score(y_test_hour, y_pred_rf_hour)

print("\nEvaluation Metrics for Hour Dataset:")
print(f"  Linear Regression - MSE: {mse_lr_hour:.2f}, R-squared: {r2_lr_hour:.2f}")
print(f"  Decision Tree Regressor - MSE: {r2_dt_hour:.2f}, R-squared: {r2_dt_hour:.2f}")
print(f"  Random Forest Regressor - MSE: {r2_rf_hour:.2f}, R-squared: {r2_rf_hour:.2f}")
