import os
import numpy as np
import pandas as pd
import random
from flask import Flask, request, jsonify, render_template
from flask import redirect, url_for, session, flash
import pickle

# Try to import Gemini AI (optional)
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    print("Google Generative AI not installed. Chatbot will use fallback responses.")

app= Flask(__name__, static_url_path='/static')
# Use a rotating secret key in dev so old cookies don't auto-login across restarts
app.secret_key = os.environ.get('FLASK_SECRET_KEY') or os.urandom(24)

# Configure Gemini AI if available
GEMINI_ENABLED = False
if GEMINI_AVAILABLE:
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'AIzaSyDlbs0UfFGfsjDlfjdslfjdslfjdslkfjds')  # Replace with your key
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel('gemini-pro')
        GEMINI_ENABLED = True
        print("Gemini AI configured successfully!")
    except Exception as e:
        print(f"Gemini AI not configured: {e}")
        GEMINI_ENABLED = False

# Load both models and scalers
with open('model_day.pkl', 'rb') as f:
    model_day = pickle.load(f)
with open('scaler_day.pkl', 'rb') as f:
    scaler_day = pickle.load(f)
with open('model_hour.pkl', 'rb') as f:
    model_hour = pickle.load(f)
with open('scaler_hour.pkl', 'rb') as f:
    scaler_hour = pickle.load(f)

# Load datasets from pickle files instead of CSV
try:
    with open('day_data.pkl', 'rb') as f:
        df_day_info = pickle.load(f)
    with open('hour_data.pkl', 'rb') as f:
        df_hour_info = pickle.load(f)
    print(f"Loaded data from pickle files: Day={len(df_day_info)} rows, Hour={len(df_hour_info)} rows")
except Exception as e:
    print(f"Error loading pickle data: {e}. Falling back to CSV.")
    df_day_info = pd.read_csv('day.csv')
    df_hour_info = pd.read_csv('hour.csv')

# Enhanced Data Analysis for Smart Chatbot
class SmartChatbotAnalyzer:
    def __init__(self, df_day, df_hour):
        self.df_day = df_day.copy() if df_day is not None and not df_day.empty else pd.DataFrame()
        self.df_hour = df_hour.copy() if df_hour is not None and not df_hour.empty else pd.DataFrame()
        self.insights_cache = {}
        self._generate_comprehensive_insights()
    
    def _generate_comprehensive_insights(self):
        """Pre-compute comprehensive insights from the datasets"""
        try:
            # Basic statistics
            self.insights_cache['basic_stats'] = self._get_basic_statistics()
            
            # Temporal patterns
            self.insights_cache['temporal'] = self._get_temporal_patterns()
            
            # Weather analysis
            self.insights_cache['weather'] = self._get_weather_analysis()
            
            # Seasonal patterns
            self.insights_cache['seasonal'] = self._get_seasonal_analysis()
            
            # User behavior patterns
            self.insights_cache['behavior'] = self._get_user_behavior()
            
            # Correlations and relationships
            self.insights_cache['correlations'] = self._get_correlation_analysis()
            
            # Peak and low patterns
            self.insights_cache['peaks'] = self._get_peak_analysis()
            
            print("✅ Smart Chatbot: Comprehensive data analysis completed!")
            
        except Exception as e:
            print(f"Error in comprehensive analysis: {e}")
            self.insights_cache = {}
    
    def _get_basic_statistics(self):
        """Get basic dataset statistics"""
        stats = {}
        
        if not self.df_hour.empty and 'cnt' in self.df_hour.columns:
            stats.update({
                'total_rentals': int(self.df_hour['cnt'].sum()),
                'avg_hourly_rentals': round(self.df_hour['cnt'].mean(), 1),
                'max_hourly_rentals': int(self.df_hour['cnt'].max()),
                'min_hourly_rentals': int(self.df_hour['cnt'].min()),
                'median_rentals': int(self.df_hour['cnt'].median()),
                'total_hours_tracked': len(self.df_hour),
            })
            
        if not self.df_day.empty and 'cnt' in self.df_day.columns:
            stats.update({
                'avg_daily_rentals': round(self.df_day['cnt'].mean(), 1),
                'max_daily_rentals': int(self.df_day['cnt'].max()),
                'total_days_tracked': len(self.df_day),
            })
            
        return stats
    
    def _get_temporal_patterns(self):
        """Analyze temporal patterns"""
        patterns = {}
        
        if not self.df_hour.empty and 'hr' in self.df_hour.columns and 'cnt' in self.df_hour.columns:
            # Hourly patterns
            hourly_avg = self.df_hour.groupby('hr')['cnt'].agg(['mean', 'std', 'count']).round(1)
            patterns['peak_hour'] = int(hourly_avg['mean'].idxmax())
            patterns['peak_hour_avg'] = round(hourly_avg['mean'].max(), 1)
            patterns['lowest_hour'] = int(hourly_avg['mean'].idxmin())
            patterns['lowest_hour_avg'] = round(hourly_avg['mean'].min(), 1)
            
            # Time of day analysis
            patterns['morning_avg'] = round(hourly_avg.loc[6:11]['mean'].mean(), 1)  # 6-11 AM
            patterns['afternoon_avg'] = round(hourly_avg.loc[12:17]['mean'].mean(), 1)  # 12-5 PM
            patterns['evening_avg'] = round(hourly_avg.loc[18:23]['mean'].mean(), 1)  # 6-11 PM
            patterns['night_avg'] = round(hourly_avg.loc[0:5]['mean'].mean(), 1)  # 12-5 AM
            
        if 'weekday' in self.df_hour.columns:
            # Day of week patterns
            daily_avg = self.df_hour.groupby('weekday')['cnt'].mean().round(1)
            day_names = {0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday'}
            patterns['best_day'] = day_names.get(daily_avg.idxmax(), 'Unknown')
            patterns['best_day_avg'] = round(daily_avg.max(), 1)
            patterns['worst_day'] = day_names.get(daily_avg.idxmin(), 'Unknown')
            patterns['worst_day_avg'] = round(daily_avg.min(), 1)
            
        return patterns
    
    def _get_weather_analysis(self):
        """Analyze weather impact"""
        weather = {}
        
        if not self.df_hour.empty and 'weathersit' in self.df_hour.columns and 'cnt' in self.df_hour.columns:
            weather_avg = self.df_hour.groupby('weathersit')['cnt'].agg(['mean', 'count']).round(1)
            weather_map = {1: 'Clear/Sunny', 2: 'Cloudy/Mist', 3: 'Light Rain/Snow', 4: 'Heavy Rain/Snow'}
            
            best_weather_id = weather_avg['mean'].idxmax()
            worst_weather_id = weather_avg['mean'].idxmin()
            
            weather.update({
                'best_weather': weather_map.get(best_weather_id, 'Clear'),
                'best_weather_avg': round(weather_avg.loc[best_weather_id, 'mean'], 1),
                'worst_weather': weather_map.get(worst_weather_id, 'Heavy Rain'),
                'worst_weather_avg': round(weather_avg.loc[worst_weather_id, 'mean'], 1),
                'weather_impact_pct': round(((weather_avg.loc[best_weather_id, 'mean'] / weather_avg.loc[worst_weather_id, 'mean']) - 1) * 100, 1)
            })
            
        return weather
    
    def _get_seasonal_analysis(self):
        """Analyze seasonal patterns"""
        seasonal = {}
        
        if not self.df_hour.empty and 'season' in self.df_hour.columns and 'cnt' in self.df_hour.columns:
            season_avg = self.df_hour.groupby('season')['cnt'].agg(['mean', 'sum', 'count']).round(1)
            season_map = {1: 'Spring', 2: 'Summer', 3: 'Fall', 4: 'Winter'}
            
            best_season_id = season_avg['mean'].idxmax()
            worst_season_id = season_avg['mean'].idxmin()
            
            seasonal.update({
                'best_season': season_map.get(best_season_id, 'Fall'),
                'best_season_avg': round(season_avg.loc[best_season_id, 'mean'], 1),
                'worst_season': season_map.get(worst_season_id, 'Winter'),
                'worst_season_avg': round(season_avg.loc[worst_season_id, 'mean'], 1),
            })
            
            # Season ranking
            seasonal['season_ranking'] = []
            for i, (season_id, stats) in enumerate(season_avg.sort_values('mean', ascending=False).iterrows(), 1):
                seasonal['season_ranking'].append({
                    'rank': i,
                    'season': season_map.get(season_id, f'Season {season_id}'),
                    'avg_rentals': round(stats['mean'], 1)
                })
                
        return seasonal
    
    def _get_user_behavior(self):
        """Analyze user behavior patterns"""
        behavior = {}
        
        if not self.df_hour.empty:
            if 'workingday' in self.df_hour.columns and 'cnt' in self.df_hour.columns:
                workday_avg = self.df_hour[self.df_hour['workingday'] == 1]['cnt'].mean()
                weekend_avg = self.df_hour[self.df_hour['workingday'] == 0]['cnt'].mean()
                
                behavior.update({
                    'workday_avg': round(workday_avg, 1),
                    'weekend_avg': round(weekend_avg, 1),
                    'workday_vs_weekend': 'Higher on workdays' if workday_avg > weekend_avg else 'Higher on weekends'
                })
                
            if 'holiday' in self.df_hour.columns and 'cnt' in self.df_hour.columns:
                holiday_avg = self.df_hour[self.df_hour['holiday'] == 1]['cnt'].mean()
                normal_avg = self.df_hour[self.df_hour['holiday'] == 0]['cnt'].mean()
                
                behavior.update({
                    'holiday_avg': round(holiday_avg, 1),
                    'normal_day_avg': round(normal_avg, 1),
                    'holiday_impact': 'Decrease' if holiday_avg < normal_avg else 'Increase'
                })
                
        return behavior
    
    def _get_correlation_analysis(self):
        """Analyze correlations between variables"""
        correlations = {}
        
        if not self.df_hour.empty and 'cnt' in self.df_hour.columns:
            numeric_cols = ['temp', 'hum', 'windspeed']
            
            for col in numeric_cols:
                if col in self.df_hour.columns:
                    corr = self.df_hour[['cnt', col]].corr().iloc[0, 1]
                    correlations[f'{col}_correlation'] = round(corr, 3)
                    correlations[f'{col}_impact'] = 'Positive' if corr > 0 else 'Negative'
                    
        return correlations
    
    def _get_peak_analysis(self):
        """Analyze peak conditions and patterns"""
        peaks = {}
        
        if not self.df_hour.empty and 'cnt' in self.df_hour.columns:
            # Find conditions during peak rentals
            max_idx = self.df_hour['cnt'].idxmax()
            peak_record = self.df_hour.loc[max_idx]
            
            peaks['peak_rental_hour'] = int(peak_record.get('hr', 17))
            peaks['peak_rental_temp'] = round(peak_record.get('temp', 0.5), 2)
            peaks['peak_rental_humidity'] = round(peak_record.get('hum', 0.5), 2)
            peaks['peak_rental_weather'] = int(peak_record.get('weathersit', 1))
            peaks['peak_rental_season'] = int(peak_record.get('season', 3))
            
            # Top 10% analysis
            top_10_pct = self.df_hour.nlargest(int(len(self.df_hour) * 0.1), 'cnt')
            
            if 'hr' in top_10_pct.columns:
                peaks['common_peak_hours'] = list(top_10_pct['hr'].mode().head(3))
            if 'weathersit' in top_10_pct.columns:
                peaks['common_peak_weather'] = int(top_10_pct['weathersit'].mode().iloc[0])
                
        return peaks

# Initialize the smart analyzer
chatbot_analyzer = SmartChatbotAnalyzer(df_day_info, df_hour_info)

# Advanced Question Processing System
class IntelligentChatbot:
    def __init__(self, analyzer):
        self.analyzer = analyzer
        self.question_patterns = self._build_question_patterns()
        
    def _build_question_patterns(self):
        """Build comprehensive question pattern recognition"""
        return {
            # Basic statistics
            'total_rentals': ['total', 'how many', 'sum', 'altogether', 'all rentals'],
            'average_rentals': ['average', 'mean', 'typical', 'usually', 'avg'],
            'maximum_rentals': ['maximum', 'highest', 'peak', 'most', 'best', 'max'],
            'minimum_rentals': ['minimum', 'lowest', 'least', 'worst', 'min'],
            
            # Time-based questions
            'peak_hours': ['peak hour', 'busy hour', 'rush hour', 'best time', 'when busy'],
            'time_patterns': ['time', 'hour', 'when', 'morning', 'evening', 'afternoon', 'night'],
            'day_patterns': ['day', 'weekday', 'weekend', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            
            # Weather questions
            'weather_impact': ['weather', 'rain', 'sunny', 'clear', 'cloudy', 'snow'],
            'best_weather': ['best weather', 'ideal weather', 'perfect weather'],
            'weather_comparison': ['weather difference', 'weather vs', 'weather impact'],
            
            # Seasonal questions
            'seasonal_patterns': ['season', 'spring', 'summer', 'fall', 'winter', 'autumn'],
            'best_season': ['best season', 'peak season', 'busy season'],
            
            # Environmental factors
            'temperature': ['temperature', 'temp', 'hot', 'cold', 'warm', 'cool'],
            'humidity': ['humidity', 'humid', 'moisture'],
            'wind': ['wind', 'windy', 'windspeed'],
            
            # User behavior
            'workday_vs_weekend': ['workday', 'weekend', 'work vs weekend', 'office day'],
            'holiday_impact': ['holiday', 'vacation', 'festival', 'special day'],
            
            # Correlations and relationships
            'correlations': ['correlation', 'relationship', 'connected', 'related', 'affects', 'impact'],
            'factors': ['factor', 'influence', 'cause', 'reason', 'why'],
            
            # Predictions and insights
            'predictions': ['predict', 'forecast', 'future', 'expect'],
            'recommendations': ['recommend', 'suggest', 'advice', 'should'],
            'insights': ['insight', 'pattern', 'trend', 'finding'],
        }
    
    def process_question(self, question):
        """Process any question and return intelligent response"""
        question_lower = question.lower()
        
        # Try to match question patterns and generate response
        for category, keywords in self.question_patterns.items():
            if any(keyword in question_lower for keyword in keywords):
                return self._generate_response_for_category(category, question_lower)
        
        # If no specific pattern matched, try general analysis
        return self._generate_general_response(question_lower)
    
    def _generate_response_for_category(self, category, question):
        """Generate specific responses based on category"""
        
        if category == 'total_rentals':
            stats = self.analyzer.insights_cache.get('basic_stats', {})
            total = stats.get('total_rentals', 0)
            return f"📊 Total bike rentals recorded: {total:,} rentals across {stats.get('total_hours_tracked', 0):,} hours of data!"
            
        elif category == 'average_rentals':
            stats = self.analyzer.insights_cache.get('basic_stats', {})
            if 'hourly' in question:
                avg = stats.get('avg_hourly_rentals', 0)
                return f"📈 Average hourly rentals: {avg} bikes per hour"
            else:
                avg_daily = stats.get('avg_daily_rentals', 0)
                avg_hourly = stats.get('avg_hourly_rentals', 0)
                return f"📈 Average rentals: {avg_daily} per day, {avg_hourly} per hour"
        
        elif category == 'maximum_rentals' or category == 'peak_hours':
            stats = self.analyzer.insights_cache.get('basic_stats', {})
            temporal = self.analyzer.insights_cache.get('temporal', {})
            max_rentals = stats.get('max_hourly_rentals', 0)
            peak_hour = temporal.get('peak_hour', 17)
            peak_avg = temporal.get('peak_hour_avg', 0)
            
            return f"🚀 Peak performance: {max_rentals} rentals in a single hour! " \
                   f"Peak hour is {peak_hour}:00 (avg {peak_avg} rentals)"
        
        elif category == 'time_patterns':
            temporal = self.analyzer.insights_cache.get('temporal', {})
            
            if any(word in question for word in ['morning']):
                return f"🌅 Morning rentals (6-11 AM): Average of {temporal.get('morning_avg', 0)} rentals per hour"
            elif any(word in question for word in ['afternoon']):
                return f"☀️ Afternoon rentals (12-5 PM): Average of {temporal.get('afternoon_avg', 0)} rentals per hour"
            elif any(word in question for word in ['evening']):
                return f"🌆 Evening rentals (6-11 PM): Average of {temporal.get('evening_avg', 0)} rentals per hour"
            elif any(word in question for word in ['night']):
                return f"🌙 Night rentals (12-5 AM): Average of {temporal.get('night_avg', 0)} rentals per hour"
            else:
                peak_hour = temporal.get('peak_hour', 17)
                lowest_hour = temporal.get('lowest_hour', 4)
                return f"⏰ Time patterns: Peak at {peak_hour}:00, lowest at {lowest_hour}:00"
        
        elif category == 'day_patterns':
            temporal = self.analyzer.insights_cache.get('temporal', {})
            best_day = temporal.get('best_day', 'Friday')
            best_avg = temporal.get('best_day_avg', 0)
            worst_day = temporal.get('worst_day', 'Sunday')
            worst_avg = temporal.get('worst_day_avg', 0)
            
            return f"📅 Daily patterns: {best_day} is busiest ({best_avg} avg), " \
                   f"{worst_day} is quietest ({worst_avg} avg)"
        
        elif category == 'weather_impact' or category == 'best_weather':
            weather = self.analyzer.insights_cache.get('weather', {})
            best_weather = weather.get('best_weather', 'Clear/Sunny')
            best_avg = weather.get('best_weather_avg', 0)
            worst_weather = weather.get('worst_weather', 'Heavy Rain')
            worst_avg = weather.get('worst_weather_avg', 0)
            impact = weather.get('weather_impact_pct', 0)
            
            return f"🌤️ Weather impact: {best_weather} is best ({best_avg} avg rentals), " \
                   f"{worst_weather} is worst ({worst_avg} avg). " \
                   f"Good weather increases rentals by {impact}%!"
        
        elif category == 'seasonal_patterns' or category == 'best_season':
            seasonal = self.analyzer.insights_cache.get('seasonal', {})
            best_season = seasonal.get('best_season', 'Fall')
            best_avg = seasonal.get('best_season_avg', 0)
            
            if seasonal.get('season_ranking'):
                ranking = seasonal['season_ranking']
                response = f"🍂 {best_season} has highest demand ({best_avg} avg rentals)\n\nFull ranking:\n"
                for rank_info in ranking:
                    response += f"{rank_info['rank']}. {rank_info['season']}: {rank_info['avg_rentals']} avg\n"
                return response
            else:
                return f"🍂 {best_season} has the highest seasonal demand with {best_avg} average rentals!"
        
        elif category == 'temperature':
            correlations = self.analyzer.insights_cache.get('correlations', {})
            temp_corr = correlations.get('temp_correlation', 0)
            temp_impact = correlations.get('temp_impact', 'Positive')
            
            peaks = self.analyzer.insights_cache.get('peaks', {})
            peak_temp_normalized = peaks.get('peak_rental_temp', 0.5)
            peak_temp_actual = format_weather_value(peak_temp_normalized, 'temperature')
            
            return f"🌡️ Temperature analysis: {temp_impact} correlation ({temp_corr}) with rentals. " \
                   f"Peak rentals occur at {peak_temp_actual} with strong correlation indicating {'warmer' if temp_corr > 0 else 'cooler'} weather encourages more bike usage."
        
        elif category == 'humidity':
            correlations = self.analyzer.insights_cache.get('correlations', {})
            hum_corr = correlations.get('hum_correlation', 0)
            hum_impact = correlations.get('hum_impact', 'Negative')
            
            # Get average humidity in actual values
            if not df_hour_info.empty and 'hum' in df_hour_info.columns:
                avg_hum_normalized = df_hour_info['hum'].mean()
                avg_hum_actual = format_weather_value(avg_hum_normalized, 'humidity')
                
                return f"💧 Humidity analysis: {hum_impact} correlation ({hum_corr}) with bike rentals.\n" \
                       f"• Average humidity: {avg_hum_actual}\n" \
                       f"• Insight: {'Lower humidity (40-60%) is more comfortable for biking' if hum_impact == 'Negative' else 'Higher humidity is associated with more rentals'}"
            else:
                return f"💧 Humidity impact: {hum_impact} correlation ({hum_corr}) - " \
                       f"{'Lower humidity (40-60%) is better for bike rentals' if hum_impact == 'Negative' else 'Higher humidity is associated with more rentals'}"
        
        elif category == 'wind':
            correlations = self.analyzer.insights_cache.get('correlations', {})
            wind_corr = correlations.get('windspeed_correlation', 0)
            wind_impact = correlations.get('windspeed_impact', 'Negative')
            
            # Get average wind speed in actual values
            if not df_hour_info.empty and 'windspeed' in df_hour_info.columns:
                avg_wind_normalized = df_hour_info['windspeed'].mean()
                avg_wind_actual = format_weather_value(avg_wind_normalized, 'windspeed')
                
                return f"💨 Wind speed analysis: {wind_impact} correlation ({wind_corr}) with bike rentals.\n" \
                       f"• Average wind speed: {avg_wind_actual}\n" \
                       f"• Insight: {'Calm conditions (0-15 km/h) are ideal for biking' if wind_impact == 'Negative' else 'Higher wind speeds are associated with more rentals'}"
            else:
                return f"💨 Wind analysis: {wind_impact} correlation ({wind_corr}) - " \
                       f"{'Lower wind speeds (0-15 km/h) are preferred for biking' if wind_impact == 'Negative' else 'Higher wind speeds are associated with more rentals'}"
        
        elif category == 'workday_vs_weekend':
            behavior = self.analyzer.insights_cache.get('behavior', {})
            workday_avg = behavior.get('workday_avg', 0)
            weekend_avg = behavior.get('weekend_avg', 0)
            pattern = behavior.get('workday_vs_weekend', 'Higher on workdays')
            
            return f"💼 Workday vs Weekend: Workdays average {workday_avg} rentals, " \
                   f"weekends average {weekend_avg} rentals. {pattern}"
        
        elif category == 'holiday_impact':
            behavior = self.analyzer.insights_cache.get('behavior', {})
            holiday_avg = behavior.get('holiday_avg', 0)
            normal_avg = behavior.get('normal_day_avg', 0)
            impact = behavior.get('holiday_impact', 'Decrease')
            
            return f"🎉 Holiday impact: Holidays show {holiday_avg} avg rentals vs {normal_avg} on normal days. " \
                   f"Holidays cause a {impact.lower()} in rentals"
        
        elif category == 'correlations':
            correlations = self.analyzer.insights_cache.get('correlations', {})
            response = "🔗 Weather factor correlations with bike rentals:\n"
            
            # Add average actual values with correlations
            if not df_hour_info.empty:
                for factor in ['temp', 'hum', 'windspeed']:
                    corr = correlations.get(f'{factor}_correlation')
                    impact = correlations.get(f'{factor}_impact', 'Unknown')
                    if corr is not None and factor in df_hour_info.columns:
                        avg_normalized = df_hour_info[factor].mean()
                        if factor == 'temp':
                            avg_actual = format_weather_value(avg_normalized, 'temperature')
                            factor_name = "Temperature"
                        elif factor == 'hum':
                            avg_actual = format_weather_value(avg_normalized, 'humidity')
                            factor_name = "Humidity"
                        elif factor == 'windspeed':
                            avg_actual = format_weather_value(avg_normalized, 'windspeed')
                            factor_name = "Wind Speed"
                        
                        strength = "Strong" if abs(corr) > 0.5 else "Moderate" if abs(corr) > 0.2 else "Weak"
                        response += f"• {factor_name}: {corr:.3f} ({strength} {impact.lower()} correlation)\n"
                        response += f"  Average: {avg_actual}\n"
            
            response += f"\n💡 Key insight: Temperature typically has the strongest influence on bike rental patterns!"
            return response
        
        elif category == 'insights':
            return self._generate_comprehensive_insights()
        
        else:
            return self._generate_general_response(question)
    
    def _generate_general_response(self, question):
        """Generate response for unmatched questions using available data"""
        
        # Try to find relevant numbers or data points mentioned
        if any(word in question for word in ['how many', 'count', 'number']):
            stats = self.analyzer.insights_cache.get('basic_stats', {})
            return f"📊 Dataset overview: {stats.get('total_rentals', 0):,} total rentals across " \
                   f"{stats.get('total_days_tracked', 0)} days and {stats.get('total_hours_tracked', 0)} hours of data"
        
        elif any(word in question for word in ['best', 'optimal', 'ideal', 'perfect']):
            return self._generate_optimal_conditions_response()
        
        elif any(word in question for word in ['trend', 'pattern', 'behavior']):
            return self._generate_comprehensive_insights()
        
        else:
            # Default to showing key insights
            return "🤔 Let me share some key insights from our bike rental data! " + self._generate_key_insights()
    
    def _generate_optimal_conditions_response(self):
        """Generate response about optimal conditions with actual weather values"""
        weather = self.analyzer.insights_cache.get('weather', {})
        temporal = self.analyzer.insights_cache.get('temporal', {})
        seasonal = self.analyzer.insights_cache.get('seasonal', {})
        peaks = self.analyzer.insights_cache.get('peaks', {})
        
        # Convert peak conditions to actual values
        peak_temp = format_weather_value(peaks.get('peak_rental_temp', 0.5), 'temperature')
        peak_hum = format_weather_value(peaks.get('peak_rental_humidity', 0.5), 'humidity') 
        
        # Calculate average conditions for best weather
        optimal_wind = "5-15 km/h"  # Typical optimal range
        
        return f"🎯 Optimal bike rental conditions:\n" \
               f"• Season: {seasonal.get('best_season', 'Fall')}\n" \
               f"• Weather: {weather.get('best_weather', 'Clear/Sunny')}\n" \
               f"• Time: {temporal.get('peak_hour', 17)}:00\n" \
               f"• Day: {temporal.get('best_day', 'Friday')}\n" \
               f"• Temperature: {peak_temp}\n" \
               f"• Humidity: {peak_hum}\n" \
               f"• Wind Speed: {optimal_wind}\n" \
               f"Expected rentals: {weather.get('best_weather_avg', 0)} per hour 🚴‍♂️"
    
    def _generate_key_insights(self):
        """Generate key insights summary"""
        stats = self.analyzer.insights_cache.get('basic_stats', {})
        temporal = self.analyzer.insights_cache.get('temporal', {})
        weather = self.analyzer.insights_cache.get('weather', {})
        
        return f"\n\n📈 Key insights:\n" \
               f"• Total: {stats.get('total_rentals', 0):,} rentals\n" \
               f"• Peak hour: {temporal.get('peak_hour', 17)}:00\n" \
               f"• Best weather: {weather.get('best_weather', 'Clear')}\n" \
               f"• Weather impact: +{weather.get('weather_impact_pct', 0)}%"
    
    def _generate_comprehensive_insights(self):
        """Generate comprehensive data insights"""
        insights = []
        
        # Top insights from each category
        stats = self.analyzer.insights_cache.get('basic_stats', {})
        temporal = self.analyzer.insights_cache.get('temporal', {})
        weather = self.analyzer.insights_cache.get('weather', {})
        seasonal = self.analyzer.insights_cache.get('seasonal', {})
        
        insights.append("🎯 Comprehensive Bike Rental Insights:\n")
        insights.append(f"📊 Volume: {stats.get('total_rentals', 0):,} total rentals, {stats.get('avg_hourly_rentals', 0)} avg/hour")
        insights.append(f"⏰ Peak time: {temporal.get('peak_hour', 17)}:00 ({temporal.get('peak_hour_avg', 0)} avg rentals)")
        insights.append(f"📅 Best day: {temporal.get('best_day', 'Friday')} ({temporal.get('best_day_avg', 0)} avg)")
        insights.append(f"🌤️ Weather: {weather.get('best_weather', 'Clear')} weather boosts rentals by {weather.get('weather_impact_pct', 0)}%")
        insights.append(f"🍂 Season: {seasonal.get('best_season', 'Fall')} is peak season ({seasonal.get('best_season_avg', 0)} avg)")
        
        return "\n".join(insights)

# Initialize intelligent chatbot
intelligent_chatbot = IntelligentChatbot(chatbot_analyzer)

# Utility functions to convert normalized values to actual values for chatbot responses
def denormalize_values(value, value_type):
    """Convert normalized values back to actual values for user-friendly display"""
    if value_type == 'temperature':
        # Convert from 0-1 back to -10°C to 40°C
        return (value * 50.0) - 10.0
    elif value_type == 'humidity':
        # Convert from 0-1 back to 0-100%
        return value * 100.0
    elif value_type == 'windspeed':
        # Convert from 0-1 back to 0-60 km/h
        return value * 60.0
    else:
        return value

def format_weather_value(normalized_value, value_type, include_unit=True):
    """Format weather values for chatbot responses"""
    actual_value = denormalize_values(normalized_value, value_type)
    
    if value_type == 'temperature':
        unit = "°C" if include_unit else ""
        return f"{actual_value:.1f}{unit}"
    elif value_type == 'humidity':
        unit = "%" if include_unit else ""
        return f"{actual_value:.0f}{unit}"
    elif value_type == 'windspeed':
        unit = " km/h" if include_unit else ""
        return f"{actual_value:.1f}{unit}"
    else:
        return f"{actual_value:.2f}"

# Preload datasets for insights and stats
FEATURES_ORDER = ['Best', 'Neutral', 'spring', 'temp', 'winter', 'summer', 'hum', 'Jul', 'Sep', 'windspeed', 'yr', 'holiday']

def _prep_df_for_features(df: pd.DataFrame) -> pd.DataFrame:
    dfc = df.copy()
    # mapping similar to training
    if 'season' in dfc.columns:
        dfc.season = dfc.season.map({1:'spring', 2:'summer', 3:'fall', 4:'winter'})
    if 'weathersit' in dfc.columns:
        dfc.weathersit = dfc.weathersit.map({1:'Best', 2:'Neutral', 3:'Bad', 4:'Worse'})
    if 'mnth' in dfc.columns:
        dfc.mnth = dfc.mnth.map({1:'Jan',2:'Feb',3:'Mar',4:'Apr',5:'May',6:'June',7:'Jul',8:'Aug',9:'Sep',10:'Oct',11:'Nov',12:'Dec'})
    if 'weekday' in dfc.columns:
        dfc.weekday = dfc.weekday.map({1:'Mon',2:'Tue',3:'Wed',4:'Thu',5:'Fri',6:'Sat',0:'Sun'})
    for col in ['instant','dteday','casual','registered','atemp']:
        if col in dfc.columns:
            dfc = dfc.drop(col, axis=1)
    def dummies(x,dataframe):
        if x in dataframe.columns:
            temp = pd.get_dummies(dataframe[x], drop_first=True)
            dataframe = pd.concat([dataframe, temp], axis=1)
            dataframe.drop([x], axis=1, inplace=True)
        return dataframe
    for col in ['season','mnth','weekday','weathersit']:
        dfc = dummies(col, dfc)
    return dfc

# Load feature names from models
try:
    feature_names_day = model_day.feature_names_in_.tolist()
    feature_names_hour = model_hour.feature_names_in_.tolist()
except Exception:
    feature_names_day = []
    feature_names_hour = []

@app.route('/')
def home():
    if not session.get('logged_in'):
        print("User not logged in, redirecting to login page")
        return redirect(url_for('login'))
    print("User logged in, showing home page")
    return render_template('home.html')

@app.route('/index')
def index():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    # allow pre-selecting dataset via query param (e.g., /index?dataset=hour)
    selected = request.args.get('dataset', 'day')
    return render_template('index.html', selected_dataset=selected)

@app.route('/insights')
def insights():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    # Feature importances
    def names_values(model, names, k=10):
        try:
            imps = list(model.feature_importances_)
            n = min(len(imps), len(names))
            pairs = list(zip(names[:n], imps[:n]))
            pairs.sort(key=lambda x: x[1], reverse=True)
            pairs = pairs[:k]
            labels = [p[0] for p in pairs]
            values = [round(float(p[1]) * 100, 2) for p in pairs]  # Convert to percentage
            return labels, values
        except Exception:
            return [], []
    
    day_labels, day_values = names_values(model_day, feature_names_day, k=10)
    hour_labels, hour_values = names_values(model_hour, feature_names_hour, k=10)
    
    # Data statistics from datasets
    stats = {}
    try:
        # Rental patterns by season
        season_counts = df_hour_info.groupby('season')['cnt'].mean().round(0).tolist()
        season_labels = ['Spring', 'Summer', 'Fall', 'Winter']
        
        # Rental patterns by weather
        weather_counts = df_hour_info.groupby('weathersit')['cnt'].mean().round(0).tolist()
        weather_labels = ['Clear', 'Cloudy', 'Light Rain', 'Heavy Rain'][:len(weather_counts)]
        
        # Hourly patterns (for hour dataset)
        if 'hr' in df_hour_info.columns:
            hourly_avg = df_hour_info.groupby('hr')['cnt'].mean().round(0).tolist()
            hour_labels_chart = list(range(24))
        else:
            hourly_avg = []
            hour_labels_chart = []
        
        # Working day vs Holiday
        workday_avg = df_hour_info[df_hour_info['workingday'] == 1]['cnt'].mean()
        holiday_avg = df_hour_info[df_hour_info['workingday'] == 0]['cnt'].mean()
        
        # Temperature correlation bins
        df_hour_info['temp_bin'] = pd.cut(df_hour_info['temp'], bins=5, labels=['Very Cold', 'Cold', 'Moderate', 'Warm', 'Hot'])
        temp_rentals = df_hour_info.groupby('temp_bin', observed=True)['cnt'].mean().round(0).tolist()
        temp_labels = ['Very Cold', 'Cold', 'Moderate', 'Warm', 'Hot'][:len(temp_rentals)]
        
        stats = {
            'season_counts': season_counts,
            'season_labels': season_labels,
            'weather_counts': weather_counts,
            'weather_labels': weather_labels,
            'hourly_avg': hourly_avg,
            'hour_labels_chart': hour_labels_chart,
            'workday_avg': round(workday_avg, 0),
            'holiday_avg': round(holiday_avg, 0),
            'temp_rentals': temp_rentals,
            'temp_labels': temp_labels,
            'total_rentals': int(df_hour_info['cnt'].sum()),
            'avg_daily_rentals': int(df_day_info['cnt'].mean()),
            'peak_hour': int(df_hour_info.groupby('hr')['cnt'].mean().idxmax()) if 'hr' in df_hour_info.columns else 17,
            'best_season': season_labels[season_counts.index(max(season_counts))],
        }
    except Exception as e:
        print(f"Error computing stats: {e}")
        stats = {}
    
    return render_template('insights.html', 
                           day_labels=day_labels, day_values=day_values,
                           hour_labels=hour_labels, hour_values=hour_values,
                           stats=stats)

@app.route('/dataset')
def dataset_page():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    def stats(df):
        if df is None or df.empty:
            return {"status": "unavailable"}
        out = {"rows": len(df), "columns": len(df.columns)}
        for col in ['temp','hum','windspeed','cnt']:
            if col in df.columns:
                out[f"avg {col}"] = round(float(df[col].mean()), 3)
        return out
    day_rows = len(df_day_info) if not df_day_info.empty else 0
    day_cols = len(df_day_info.columns) if not df_day_info.empty else 0
    hour_rows = len(df_hour_info) if not df_hour_info.empty else 0
    hour_cols = len(df_hour_info.columns) if not df_hour_info.empty else 0
    return render_template('dataset.html',
                           day_rows=day_rows,
                           day_cols=day_cols,
                           hour_rows=hour_rows,
                           hour_cols=hour_cols,
                           day_stats=stats(df_day_info),
                           hour_stats=stats(df_hour_info))

@app.route('/contact', methods=['GET','POST'])
def contact():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    msg = ''
    if request.method == 'POST':
        # In a real app, you'd send an email or store the message
        msg = 'Thanks for reaching out! We\'ll get back to you soon.'
    return render_template('contact.html', msg=msg)

@app.route('/chatbot')
def chatbot():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    return render_template('chatbot.html')

@app.route('/chatbot_api', methods=['POST'])
def chatbot_api():
    if not session.get('logged_in'):
        return jsonify({"error": "unauthorized"}), 401
    try:
        data = request.get_json(silent=True) or {}
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({"reply": "Please enter a message."})
        
        # First try the intelligent chatbot system
        try:
            intelligent_response = intelligent_chatbot.process_question(user_message)
            if intelligent_response:
                return jsonify({"reply": intelligent_response})
        except Exception as intelligent_error:
            print(f"Intelligent chatbot error: {intelligent_error}")
        
        # Try to use Gemini AI as backup
        if GEMINI_ENABLED:
            try:
                # Enhanced context with comprehensive data insights
                comprehensive_context = f"""You are an advanced bike rental prediction assistant for RideWise system with access to comprehensive analytics.

DATASET OVERVIEW:
- Daily dataset: {len(df_day_info)} records
- Hourly dataset: {len(df_hour_info)} records
- Total bike rentals tracked: {chatbot_analyzer.insights_cache.get('basic_stats', {}).get('total_rentals', 'N/A')}

KEY INSIGHTS FROM DATA:
{intelligent_chatbot._generate_key_insights()}

ADVANCED ANALYTICS AVAILABLE:
- Temporal patterns (hourly, daily, seasonal)
- Weather impact analysis (temperature, humidity, wind, conditions)
- User behavior patterns (workday vs weekend, holidays)
- Peak performance analysis
- Correlation analysis between factors
- Predictive modeling capabilities

User question: {user_message}

Instructions:
- Use the provided data insights to give specific, accurate answers
- Include relevant statistics and numbers when available
- Use engaging emojis (🚴‍♂️, 📊, 🌡️, ⏰, 🌤️, �)
- Provide actionable insights
- If you don't have specific data, acknowledge it and provide general guidance
- Keep responses informative but concise (3-5 sentences max)"""
                
                response = gemini_model.generate_content(comprehensive_context)
                reply = response.text
                return jsonify({"reply": reply})
                
            except Exception as gemini_error:
                print(f"Gemini AI error: {gemini_error}")
        
        # Final fallback to enhanced fallback system
        reply = get_fallback_response(user_message.lower())
        return jsonify({"reply": reply})
        
    except Exception as e:
        print(f"Chatbot API error: {e}")
        return jsonify({"reply": "🤖 I'm having trouble processing your question right now. Please try asking about bike rental patterns, weather impact, or time trends!"})

def get_fallback_response(text):
    """Enhanced fallback responses for bike rental questions"""
    try:
        # Convert to lowercase for better matching
        text_lower = text.lower()
        
        # Very specific time and day queries (e.g., "5 PM on Saturday", "tell me at 3 am")
        if any(k in text_lower for k in ['pm', 'am', 'o\'clock']) or (any(k in text_lower for k in ['at', 'tell me']) and any(k in text_lower for k in ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])):
            return get_specific_time_insights(text)
        
        # Weather condition best/worst questions
        elif any(k in text_lower for k in ['which weather', 'what weather', 'best weather', 'worst weather']) and any(k in text_lower for k in ['condition', 'best', 'worst']):
            return get_weather_insights(text)
        
        # Season questions with highest/demand context
        elif any(k in text_lower for k in ['season', 'seasonal', 'spring', 'summer', 'fall', 'winter', 'autumn']) and any(k in text_lower for k in ['highest', 'most', 'best', 'peak']):
            return get_seasonal_insights(text)
        
        # Temperature questions (specific temperature terms)
        elif any(k in text_lower for k in ['temperature', 'temp']) or (any(k in text_lower for k in ['hot', 'cold', 'warm', 'cool']) and any(k in text_lower for k in ['affect', 'impact', 'effect', 'influence'])):
            return get_temperature_insights(text)
        
        # Weather questions (specific weather terms)
        elif any(k in text_lower for k in ['weather', 'rain', 'rainy', 'sunny', 'clear', 'cloudy', 'snow', 'storm']):
            return get_weather_insights(text)
        
        # Time questions (general time-related queries)
        elif any(k in text_lower for k in ['time', 'hour', 'when', 'morning', 'evening', 'afternoon', 'night', 'peak time']) and not any(k in text_lower for k in ['season', 'pm', 'am']):
            return get_time_insights(text)
        
        # Dataset questions (data-specific terms)
        elif any(k in text_lower for k in ['dataset', 'data', 'records', 'rows', 'columns', 'features']):
            return get_dataset_insights(text)
        
        # General season questions (without demand context)
        elif any(k in text_lower for k in ['season', 'seasonal', 'spring', 'summer', 'fall', 'winter', 'autumn']):
            return get_seasonal_insights(text)
        
        # Peak/highest demand questions (very specific)
        elif any(k in text_lower for k in ['highest', 'peak', 'maximum', 'most popular']) and any(k in text_lower for k in ['demand', 'rental', 'bikes']):
            return get_rental_insights(text)
        
        # General rental/demand questions (last as keywords are common)
        elif any(k in text_lower for k in ['rental', 'count', 'bikes', 'demand', 'popular']):
            return get_rental_insights(text)
        
        # Greeting
        elif any(k in text for k in ['hello','hi','hey','hii']):
            return 'Hi! �‍♂️ I\'m your bike rental assistant. Ask me about temperature effects, weather patterns, time trends, or rental statistics!'
        
        # Help
        elif any(k in text for k in ['help', 'how', 'what can you']):
            return get_help_response()
        
        # Default response
        else:
            return get_random_bike_fact()
            
    except Exception as e:
        print(f"Error in fallback response: {e}")
        return "I'm here to help with bike rental questions! Ask me about weather, temperature, time patterns, or rental statistics."

def get_temperature_insights(text):
    """Get temperature-related insights with actual temperature values"""
    try:
        if 'temp' in df_hour_info.columns and 'cnt' in df_hour_info.columns:
            avg_temp_normalized = df_hour_info['temp'].mean()
            avg_temp_actual = format_weather_value(avg_temp_normalized, 'temperature')
            temp_corr = df_hour_info[['temp', 'cnt']].corr().iloc[0,1]
            
            # Temperature bins analysis with actual values
            df_temp = df_hour_info.copy()
            df_temp['temp_actual'] = df_temp['temp'].apply(lambda x: denormalize_values(x, 'temperature'))
            
            # Create bins based on actual temperature ranges
            df_temp['temp_bin'] = pd.cut(df_temp['temp_actual'], 
                                       bins=[-15, 0, 10, 20, 30, 45], 
                                       labels=['Very Cold (<0°C)', 'Cold (0-10°C)', 'Mild (10-20°C)', 'Warm (20-30°C)', 'Hot (>30°C)'])
            temp_stats = df_temp.groupby('temp_bin', observed=True)['cnt'].agg(['mean', 'count']).round(1)
            
            if not temp_stats.empty:
                best_temp = temp_stats['mean'].idxmax()
                best_temp_avg = temp_stats.loc[best_temp, 'mean']
                
                # Find the actual temperature range for best performance
                best_temp_data = df_temp[df_temp['temp_bin'] == best_temp]['temp_actual']
                min_best = best_temp_data.min()
                max_best = best_temp_data.max()
                
                return f"🌡️ Temperature Analysis:\n" \
                       f"• Average temperature: {avg_temp_actual}\n" \
                       f"• Temperature-rental correlation: {temp_corr:.3f} ({'Strong positive' if temp_corr > 0.5 else 'Moderate positive' if temp_corr > 0.2 else 'Weak' if temp_corr > 0 else 'Negative'} relationship)\n" \
                       f"• Best temperature range: {best_temp} (avg {best_temp_avg:.0f} rentals)\n" \
                       f"• Optimal conditions: {min_best:.1f}°C - {max_best:.1f}°C\n" \
                       f"• 💡 Insight: {'Warmer weather encourages more bike rentals!' if temp_corr > 0.2 else 'Temperature has moderate impact on rentals.'}"
            else:
                return f"🌡️ Temperature Analysis:\n" \
                       f"• Average temperature: {avg_temp_actual}\n" \
                       f"• Temperature-rental correlation: {temp_corr:.3f}\n" \
                       f"• Moderate temperatures (15-25°C) typically see highest bike rental demand!"
        else:
            return "🌡️ Temperature data shows moderate temperatures (15-25°C) typically have highest bike rental demand!"
    except Exception as e:
        return "🌡️ Temperature significantly affects bike rentals - moderate temperatures (15-25°C) usually see the highest demand!"

def get_weather_insights(text):
    """Get weather-related insights with specific answers"""
    try:
        text_lower = text.lower()
        
        if 'weathersit' in df_hour_info.columns and 'cnt' in df_hour_info.columns:
            weather_map = {1: 'Clear/Sunny', 2: 'Cloudy/Mist', 3: 'Light Rain/Snow', 4: 'Heavy Rain/Snow'}
            weather_stats = df_hour_info.groupby('weathersit')['cnt'].agg(['mean', 'count']).round(1)
            
            best_weather = weather_stats['mean'].idxmax()
            worst_weather = weather_stats['mean'].idxmin()
            
            # Check if asking specifically about best weather
            if any(k in text_lower for k in ['which weather', 'what weather', 'best weather']) and any(k in text_lower for k in ['condition', 'best']):
                return f"🌤️ {weather_map.get(best_weather, 'Clear/Sunny')} is the best weather condition for bike rentals with an average of {weather_stats.loc[best_weather, 'mean']:.0f} rentals per hour!"
            
            # Check if asking about worst weather
            elif any(k in text_lower for k in ['worst weather', 'bad weather', 'poorest weather']):
                return f"🌧️ {weather_map.get(worst_weather, 'Heavy Rain/Snow')} is the worst weather condition for bike rentals with only {weather_stats.loc[worst_weather, 'mean']:.0f} rentals per hour on average."
            
            # General weather impact
            else:
                sorted_weather = weather_stats.sort_values('mean', ascending=False)
                insights = [f"🌤️ Weather Impact on Bike Rentals:"]
                
                for i, (weather_id, stats) in enumerate(sorted_weather.iterrows(), 1):
                    weather_name = weather_map.get(weather_id, f'Weather {weather_id}')
                    insights.append(f"{i}. {weather_name}: {stats['mean']:.0f} avg rentals")
                
                increase_pct = ((weather_stats.loc[best_weather, 'mean'] / weather_stats.loc[worst_weather, 'mean'] - 1) * 100)
                insights.append(f"\n💡 Clear weather increases rentals by {increase_pct:.0f}% compared to bad weather!")
                
                return "\n".join(insights)
        else:
            return "🌤️ Clear/Sunny weather is best for bike rentals, while Heavy Rain/Snow significantly reduces demand!"
    except Exception as e:
        return "🌤️ Clear sunny weather drives the highest bike rental demand, while rain and snow significantly reduce rentals!"

def get_time_insights(text):
    """Get time-based insights"""
    try:
        insights = []
        
        # Hourly patterns
        if 'hr' in df_hour_info.columns and 'cnt' in df_hour_info.columns:
            hourly_avg = df_hour_info.groupby('hr')['cnt'].mean()
            peak_hour = hourly_avg.idxmax()
            peak_count = hourly_avg.max()
            low_hour = hourly_avg.idxmin()
            low_count = hourly_avg.min()
            
            insights.append(f"⏰ Time Patterns:")
            insights.append(f"• Peak hour: {peak_hour}:00 (avg {peak_count:.0f} rentals)")
            insights.append(f"• Lowest hour: {low_hour}:00 (avg {low_count:.0f} rentals)")
            
            # Time of day analysis
            morning_avg = hourly_avg[6:12].mean()  # 6 AM - 12 PM
            afternoon_avg = hourly_avg[12:18].mean()  # 12 PM - 6 PM
            evening_avg = hourly_avg[18:24].mean()  # 6 PM - 12 AM
            night_avg = hourly_avg[0:6].mean()  # 12 AM - 6 AM
            
            time_periods = [
                ('Morning (6-12)', morning_avg),
                ('Afternoon (12-18)', afternoon_avg),
                ('Evening (18-24)', evening_avg),
                ('Night (0-6)', night_avg)
            ]
            best_period = max(time_periods, key=lambda x: x[1])
            
            insights.append(f"• Best time period: {best_period[0]} (avg {best_period[1]:.0f} rentals)")
        
        # Daily patterns
        if 'weekday' in df_hour_info.columns:
            day_map = {0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday'}
            daily_avg = df_hour_info.groupby('weekday')['cnt'].mean()
            best_day = daily_avg.idxmax()
            worst_day = daily_avg.idxmin()
            
            insights.append(f"• Best day: {day_map[best_day]} (avg {daily_avg[best_day]:.0f} rentals)")
            insights.append(f"• Lowest day: {day_map[worst_day]} (avg {daily_avg[worst_day]:.0f} rentals)")
        
        return "\n".join(insights) if insights else "⏰ Peak rental times are typically morning and evening rush hours!"
        
    except Exception as e:
        return "⏰ Bike rentals peak during commuting hours (8-9 AM and 5-6 PM) and are lower at night!"

def get_specific_time_insights(text):
    """Get specific time and day insights (e.g., '5 PM on Saturday')"""
    try:
        text_lower = text.lower()
        
        # Extract hour from text
        hour = None
        if 'pm' in text_lower or 'am' in text_lower:
            import re
            time_match = re.search(r'(\d+)\s*(pm|am)', text_lower)
            if time_match:
                hour_12 = int(time_match.group(1))
                period = time_match.group(2)
                if period == 'pm' and hour_12 != 12:
                    hour = hour_12 + 12
                elif period == 'am' and hour_12 == 12:
                    hour = 0
                else:
                    hour = hour_12
        
        # Extract day from text
        day_map = {'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6, 'sunday': 0}
        weekday = None
        for day_name, day_num in day_map.items():
            if day_name in text_lower:
                weekday = day_num
                break
        
        # Get specific data if we have both hour and day
        if hour is not None and weekday is not None and 'hr' in df_hour_info.columns and 'weekday' in df_hour_info.columns:
            specific_data = df_hour_info[(df_hour_info['hr'] == hour) & (df_hour_info['weekday'] == weekday)]
            if not specific_data.empty and 'cnt' in df_hour_info.columns:
                avg_rentals = specific_data['cnt'].mean()
                day_name = list(day_map.keys())[list(day_map.values()).index(weekday)]
                hour_display = f"{hour % 12 if hour % 12 != 0 else 12} {'PM' if hour >= 12 else 'AM'}"
                return f"🕐 At {hour_display} on {day_name.title()}: Average of {avg_rentals:.0f} bike rentals 🚴‍♂️"
        
        # If only hour is specified
        elif hour is not None and 'hr' in df_hour_info.columns:
            hour_data = df_hour_info[df_hour_info['hr'] == hour]
            if not hour_data.empty and 'cnt' in df_hour_info.columns:
                avg_rentals = hour_data['cnt'].mean()
                hour_display = f"{hour % 12 if hour % 12 != 0 else 12} {'PM' if hour >= 12 else 'AM'}"
                return f"🕐 At {hour_display}: Average of {avg_rentals:.0f} bike rentals across all days 🚴‍♂️"
        
        # If only day is specified
        elif weekday is not None and 'weekday' in df_hour_info.columns:
            day_data = df_hour_info[df_hour_info['weekday'] == weekday]
            if not day_data.empty and 'cnt' in df_hour_info.columns:
                avg_rentals = day_data['cnt'].mean()
                day_name = list(day_map.keys())[list(day_map.values()).index(weekday)]
                return f"📅 On {day_name.title()}s: Average of {avg_rentals:.0f} bike rentals per hour 🚴‍♂️"
        
        # Fallback to general time insights
        return get_time_insights(text)
        
    except Exception as e:
        return "🕐 For specific time queries, try asking like '5 PM on Saturday' or 'Monday morning rentals'!"

def get_dataset_insights(text):
    """Get dataset-related insights"""
    try:
        day_rows = len(df_day_info) if not df_day_info.empty else 0
        hour_rows = len(df_hour_info) if not df_hour_info.empty else 0
        
        insights = [
            f"📊 Dataset Information:",
            f"• Daily dataset: {day_rows:,} records",
            f"• Hourly dataset: {hour_rows:,} records"
        ]
        
        if not df_hour_info.empty:
            total_rentals = df_hour_info['cnt'].sum() if 'cnt' in df_hour_info.columns else 0
            avg_daily = df_day_info['cnt'].mean() if 'cnt' in df_day_info.columns and not df_day_info.empty else 0
            
            insights.extend([
                f"• Total bike rentals recorded: {total_rentals:,}",
                f"• Average daily rentals: {avg_daily:.0f}",
                f"• Data includes weather, seasonal, and temporal features"
            ])
        
        return "\n".join(insights)
        
    except Exception as e:
        return f"📊 We have comprehensive datasets with daily and hourly bike rental records including weather and temporal data!"

def get_rental_insights(text):
    """Get rental count insights"""
    try:
        if 'cnt' in df_hour_info.columns and not df_hour_info.empty:
            total_rentals = df_hour_info['cnt'].sum()
            avg_hourly = df_hour_info['cnt'].mean()
            max_hourly = df_hour_info['cnt'].max()
            min_hourly = df_hour_info['cnt'].min()
            
            # Find conditions for max rentals
            max_idx = df_hour_info['cnt'].idxmax()
            max_record = df_hour_info.loc[max_idx]
            
            insights = [
                f"🚴‍♂️ Rental Statistics:",
                f"• Total rentals in dataset: {total_rentals:,}",
                f"• Average hourly rentals: {avg_hourly:.0f}",
                f"• Peak single hour: {max_hourly:.0f} rentals",
                f"• Minimum hourly: {min_hourly:.0f} rentals"
            ]
            
            if 'temp' in max_record.index:
                insights.append(f"• Peak rental conditions: Temp {max_record.get('temp', 'N/A'):.2f}, Hour {max_record.get('hr', 'N/A')}")
            
            return "\n".join(insights)
        else:
            return "🚴‍♂️ Our system tracks comprehensive bike rental patterns with detailed hourly and daily statistics!"
            
    except Exception as e:
        return "🚴‍♂️ Bike rental demand varies significantly based on weather, time, and seasonal factors!"

def get_seasonal_insights(text):
    """Get seasonal insights with specific answers to demand questions"""
    try:
        if 'season' in df_hour_info.columns and 'cnt' in df_hour_info.columns:
            season_map = {1: 'Spring', 2: 'Summer', 3: 'Fall', 4: 'Winter'}
            seasonal_stats = df_hour_info.groupby('season')['cnt'].agg(['mean', 'sum', 'count']).round(1)
            
            best_season = seasonal_stats['mean'].idxmax()
            worst_season = seasonal_stats['mean'].idxmin()
            
            # Check if asking specifically about highest demand
            if any(k in text.lower() for k in ['highest', 'most', 'peak', 'maximum']):
                return f"🍂 {season_map[best_season]} has the highest bike rental demand with an average of {seasonal_stats.loc[best_season, 'mean']:.0f} rentals per hour!"
            
            # Check if asking about lowest demand
            elif any(k in text.lower() for k in ['lowest', 'least', 'minimum', 'worst']):
                return f"🍂 {season_map[worst_season]} has the lowest bike rental demand with an average of {seasonal_stats.loc[worst_season, 'mean']:.0f} rentals per hour."
            
            # General seasonal overview
            else:
                insights = [
                    f"🍂 Seasonal Rental Patterns:",
                    f"• Highest demand: {season_map[best_season]} (avg {seasonal_stats.loc[best_season, 'mean']:.0f} rentals)",
                    f"• Lowest demand: {season_map[worst_season]} (avg {seasonal_stats.loc[worst_season, 'mean']:.0f} rentals)"
                ]
                
                # Add all seasonal data
                sorted_seasons = seasonal_stats.sort_values('mean', ascending=False)
                insights.append(f"\nComplete ranking:")
                for i, (season_num, stats) in enumerate(sorted_seasons.iterrows(), 1):
                    season_name = season_map[season_num]
                    insights.append(f"{i}. {season_name}: {stats['mean']:.0f} avg rentals")
                
                return "\n".join(insights)
        else:
            return "🍂 Fall has the highest bike rental demand, followed by Summer, Spring, and Winter!"
            
    except Exception as e:
        return "🍂 Fall typically has the highest bike rental demand among all seasons!"

def get_help_response():
    """Help response"""
    return """🚴‍♂️ I can help you with:

📊 Dataset Questions: "How many records?", "What data do you have?"
🌡️ Temperature: "How does temperature affect rentals?"
🌤️ Weather: "Best weather for bike rentals?"
⏰ Time Patterns: "When are peak hours?", "Best day for rentals?"
📈 Rental Stats: "Average rentals per day?", "Peak rental counts?"
🍂 Seasonal Trends: "Best season for bikes?", "Winter vs summer rentals?"

Just ask naturally - I understand conversational questions!"""

def get_random_bike_fact():
    """Return random interesting bike rental facts"""
    
    facts = [
        "🚴‍♂️ Did you know? Bike rentals typically peak during evening rush hours (5-6 PM)!",
        "🌡️ Interesting fact: Moderate temperatures (60-75°F) see the highest bike rental demand!",
        "🌤️ Weather matters: Clear days can have 2-3x more rentals than rainy days!",
        "⏰ Peak insight: Morning (8-9 AM) and evening (5-6 PM) are the busiest rental times!",
        "🍂 Seasonal trend: Fall typically shows the highest average bike rental demand!",
        "📊 Data insight: Weekdays often have higher rentals than weekends due to commuting!",
        "🚴‍♀️ Fun fact: Humidity levels below 60% are optimal for bike rental demand!",
        "🌬️ Wind effect: Low wind speeds encourage more people to rent bikes!",
        "📈 Pattern: Bike rentals show strong correlation with temperature and weather conditions!",
        "🏙️ Urban insight: Bike sharing systems see predictable daily and seasonal patterns!"
    ]
    
    return random.choice(facts)

@app.route('/predict', methods=['POST'])
def predict():
    if not session.get('logged_in'):
        return redirect(url_for('login'))

    # Determine which dataset/model to use
    dataset = request.args.get('dataset', request.form.get('dataset', 'day'))
    if dataset not in ['day', 'hour']:
        dataset = 'day'
    if dataset == 'day':
        model = model_day
        scaler = scaler_day
        expected = ['weather','Seasons','temp','hum','Month','windspeed','yr','holiday']
        rescaling_cols=['temp', 'hum', 'windspeed']
    else:
        model = model_hour
        scaler = scaler_hour
        expected = ['weather','Seasons','temp','hum','Month','windspeed','yr','holiday','hr','weekday','workingday']
        rescaling_cols=['temp', 'hum', 'windspeed']

    # Build input dict with proper types
    input_data = {}
    for k in expected:
        v = request.form.get(k, None)
        if v is None:
            input_data[k] = 0.0
        else:
            try:
                input_data[k] = float(v)
            except Exception:
                input_data[k] = 0.0

    # Convert actual values to normalized values for the model
    def normalize_inputs(data):
        """Convert actual values to normalized values as expected by the model"""
        normalized_data = data.copy()
        
        # Temperature: Convert Celsius to normalized (assuming range -10°C to 40°C -> 0 to 1)
        if 'temp' in normalized_data:
            temp_celsius = normalized_data['temp']
            # Normalization: (temp + 10) / 50 to map -10°C->0, 40°C->1
            normalized_data['temp'] = max(0.0, min(1.0, (temp_celsius + 10) / 50.0))
        
        # Humidity: Convert percentage to normalized (0-100% -> 0-1)
        if 'hum' in normalized_data:
            humidity_percent = normalized_data['hum']
            normalized_data['hum'] = max(0.0, min(1.0, humidity_percent / 100.0))
        
        # Wind speed: Convert km/h to normalized (assuming 0-60 km/h -> 0-1)
        if 'windspeed' in normalized_data:
            wind_kmh = normalized_data['windspeed']
            normalized_data['windspeed'] = max(0.0, min(1.0, wind_kmh / 60.0))
            
        return normalized_data

    # Apply normalization to input data
    input_data = normalize_inputs(input_data)
    
    # Create DataFrame with normalized input
    df = pd.DataFrame([input_data])
    
    # Map numeric values to categorical strings (like training does)
    season_map = {1:'spring', 2:'summer', 3:'fall', 4:'winter'}
    weather_map = {1:'Best', 2:'Neutral', 3:'Bad', 4:'Worse'}
    month_map = {1:'Jan',2:'Feb',3:'Mar',4:'Apr',5:'May',6:'June',7:'Jul',8:'Aug',9:'Sep',10:'Oct',11:'Nov',12:'Dec'}
    
    if 'Seasons' in df.columns:
        df['season'] = df['Seasons'].map(season_map)
        df = df.drop('Seasons', axis=1)
    if 'weather' in df.columns:
        df['weathersit'] = df['weather'].map(weather_map)
        df = df.drop('weather', axis=1)
    if 'Month' in df.columns:
        df['mnth'] = df['Month'].map(month_map)
        df = df.drop('Month', axis=1)
    
    # Create interaction features BEFORE one-hot encoding
    if 'temp' in df.columns and 'hum' in df.columns:
        df['temp_hum'] = df['temp'] * df['hum']
    if 'temp' in df.columns and 'windspeed' in df.columns:
        df['temp_wind'] = df['temp'] * df['windspeed']
    if 'yr' in df.columns and 'mnth' in df.columns:
        df['yr_mnth_interaction'] = df['yr'].astype(int).astype(str) + '_' + df['mnth'].astype(str)
    
    # Create dummy variables using the same method as training
    # Note: Only create dummies for categorical columns, not mnth (since we use yr_mnth_interaction instead)
    def dummies(x, dataframe):
        if x in dataframe.columns:
            temp = pd.get_dummies(dataframe[x], drop_first=True)
            dataframe = pd.concat([dataframe, temp], axis=1)
            dataframe = dataframe.drop(x, axis=1)
        return dataframe
    
    # Drop mnth before creating dummies since we use yr_mnth_interaction
    if 'mnth' in df.columns:
        df = df.drop('mnth', axis=1)
    
    for col in ['season', 'weathersit', 'yr_mnth_interaction']:
        df = dummies(col, df)
    
    # Debug: print what we have vs what model expects
    print(f"DataFrame columns after dummies: {sorted(df.columns.tolist())}")
    print(f"Model expects: {sorted(model.feature_names_in_.tolist())}")
    
    # Ensure all expected features are present (add missing with 0)
    for feat in model.feature_names_in_:
        if feat not in df.columns:
            df[feat] = 0
    
    # Keep only the features the model expects, in the correct order
    df = df[model.feature_names_in_]
    
    # Scale numeric features
    rescaling_cols_full = ['temp', 'hum', 'windspeed', 'temp_hum', 'temp_wind']
    cols_to_scale = [c for c in rescaling_cols_full if c in df.columns]
    if cols_to_scale:
        df[cols_to_scale] = scaler.transform(df[cols_to_scale])

    #Prediction of the trained model
    prediction= model.predict(df)
    #Output derived from the ML model
    output= round(prediction[0], 2)

    #Output sent to the html page, keep dataset selection
    return render_template('index.html', prediction_text='Prediction: \n {} bike rents.'.format(output), selected_dataset=dataset)


@app.route('/filter', methods=['POST'])
def filter_data():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    dataset = request.form.get('dataset', 'day')
    return redirect(url_for('index', dataset=dataset))
@app.route('/login', methods=['GET', 'POST'])
def login():
    print(f"Login route accessed, method: {request.method}")
    if session.get('logged_in'):
        print("Already logged in, redirecting to home")
        return redirect(url_for('home'))
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        print(f"Login attempt: username={username}")
        if username == 'gadhavea368@gmail.com' and password == 'Ankita@21':
            session['logged_in'] = True
            print("Login successful!")
            return redirect(url_for('home'))
        else:
            print("Login failed - invalid credentials")
            flash('Invalid email or password', 'danger')
    print("Rendering login.html")
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/change_password', methods=['GET', 'POST'])
def change_password():
    msg = ''
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    if request.method == 'POST':
        old = request.form.get('old_password')
        new = request.form.get('new_password')
        confirm = request.form.get('confirm_password')
        # Only allow change if old is correct and new matches confirm
        if old == 'Ankita@21' and new and new == confirm:
            msg = 'Password changed (demo: not persisted, resets on restart)'
        else:
            msg = 'Password change failed. Check your entries.'
    return render_template('change_password.html', msg=msg)

if __name__=="__main__":
    import os
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'development') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)