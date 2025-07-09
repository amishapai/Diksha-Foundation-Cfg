import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Load the data
df = pd.read_excel('complete_data_with_assessments.xlsx')

# Create a 'Center' column based on Roll No prefix
df['Center'] = df['Roll No'].str.extract(r'^([A-Z]+)')[0]
df['Center_Name'] = df['Center'].map({'BIH': 'Bihar', 'PAT': 'Patna', 'SMT': 'SMT'})

# Save to CSV
if not os.path.exists('output'):
    os.makedirs('output')
df.to_csv('output/complete_student_data.csv', index=False)

# Set style for plots
sns.set_theme(style="whitegrid")
plt.figure(figsize=(10, 6))

# =============================================
# ADMIN VISUALIZATIONS (Comparing Centers)
# =============================================

print("\nGenerating Admin Visualizations...")

# 1. Overall Performance by Center
plt.figure(figsize=(12, 6))
sns.boxplot(x='Center_Name', y='Total %', data=df)
plt.title('Overall Performance Distribution by Center')
plt.savefig('output/admin_1_overall_performance_by_center.png')
plt.close()

# 2. Average Score by Grade Across Centers
plt.figure(figsize=(14, 7))
grade_center_avg = df.groupby(['Grade', 'Center_Name'])['Total %'].mean().unstack()
grade_center_avg.plot(kind='bar')
plt.title('Average Performance by Grade Across Centers')
plt.ylabel('Average Percentage')
plt.xticks(rotation=0)
plt.tight_layout()
plt.savefig('output/admin_2_avg_score_by_grade_center.png')
plt.close()

# 3. Gender Performance Comparison Across Centers
plt.figure(figsize=(12, 6))
sns.barplot(x='Center_Name', y='Total %', hue='Gender (M/F)', data=df, ci=None)
plt.title('Gender Performance Comparison Across Centers')
plt.savefig('output/admin_3_gender_comparison.png')
plt.close()

# 4. Question-wise Performance by Center
question_cols = ['Q1','Q2','Q3','Q4','Q5','Q6','Q7','Q8','Q9','Q10']
question_means = df.groupby('Center_Name')[question_cols].mean().T
plt.figure(figsize=(14, 7))
question_means.plot(kind='bar')
plt.title('Average Question Performance by Center')
plt.ylabel('Average Score (out of 3)')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('output/admin_4_question_performance.png')
plt.close()

# 5. Score Distribution by Center
plt.figure(figsize=(12, 6))
sns.histplot(data=df, x='Total %', hue='Center_Name', element='step', bins=15)
plt.title('Score Distribution by Center')
plt.savefig('output/admin_5_score_distribution.png')
plt.close()

# 6. Section Performance Across Centers
plt.figure(figsize=(12, 6))
sns.boxplot(x='Section', y='Total %', hue='Center_Name', data=df)
plt.title('Section Performance Comparison Across Centers')
plt.savefig('output/admin_6_section_performance.png')
plt.close()

# 7. Top/Bottom Performers by Center
top_bottom = df.groupby('Center_Name').apply(
    lambda x: pd.concat([x.nlargest(5, 'Total %'), x.nsmallest(5, 'Total %')])
).reset_index(drop=True)
top_bottom.to_csv('output/admin_top_bottom_performers.csv', index=False)

# =============================================
# TEACHER VISUALIZATIONS (Within Each Center)
# =============================================

print("\nGenerating Teacher Visualizations for Each Center...")

for center in ['BIH', 'PAT', 'SMT']:
    center_df = df[df['Center'] == center]
    center_name = center_df['Center_Name'].iloc[0]
    
    if not os.path.exists(f'output/{center_name}'):
        os.makedirs(f'output/{center_name}')
    
    # 1. Performance Distribution by Grade
    plt.figure(figsize=(12, 6))
    sns.boxplot(x='Grade', y='Total %', data=center_df)
    plt.title(f'{center_name} - Performance Distribution by Grade')
    plt.savefig(f'output/{center_name}/teacher_1_grade_performance.png')
    plt.close()
    
    # 2. Section-wise Performance
    plt.figure(figsize=(12, 6))
    sns.boxplot(x='Section', y='Total %', data=center_df)
    plt.title(f'{center_name} - Section-wise Performance')
    plt.savefig(f'output/{center_name}/teacher_2_section_performance.png')
    plt.close()
    
    # 3. Gender Performance Comparison
    plt.figure(figsize=(10, 6))
    sns.barplot(x='Grade', y='Total %', hue='Gender (M/F)', data=center_df, ci=None)
    plt.title(f'{center_name} - Gender Performance by Grade')
    plt.savefig(f'output/{center_name}/teacher_3_gender_performance.png')
    plt.close()
    
    # 4. Question-wise Performance
    plt.figure(figsize=(14, 7))
    question_means = center_df[question_cols].mean().sort_values()
    question_means.plot(kind='bar')
    plt.title(f'{center_name} - Average Question Performance')
    plt.ylabel('Average Score (out of 3)')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(f'output/{center_name}/teacher_4_question_performance.png')
    plt.close()
    
    # 5. Score Distribution by Section
    plt.figure(figsize=(12, 6))
    sns.histplot(data=center_df, x='Total %', hue='Section', element='step', bins=15)
    plt.title(f'{center_name} - Score Distribution by Section')
    plt.savefig(f'output/{center_name}/teacher_5_section_distribution.png')
    plt.close()
    
    # 6. Top/Bottom Performers by Section
    top_bottom_center = center_df.groupby('Section').apply(
        lambda x: pd.concat([x.nlargest(3, 'Total %'), x.nsmallest(3, 'Total %')])
    ).reset_index(drop=True)
    top_bottom_center.to_csv(f'output/{center_name}/teacher_top_bottom_performers.csv', index=False)
    
    # 7. Age vs Performance
    plt.figure(figsize=(12, 6))
    sns.scatterplot(x='DOB /Age', y='Total %', hue='Section', data=center_df)
    plt.title(f'{center_name} - Age vs Performance')
    plt.savefig(f'output/{center_name}/teacher_6_age_vs_performance.png')
    plt.close()

print("\nVisualizations generated successfully in the 'output' folder!")