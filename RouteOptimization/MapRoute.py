import pandas as pd
import json

def parse_csv_file(file_path):
    return pd.read_csv(file_path)

def convert_keys_to_strings(d):
    return {str(k): v for k, v in d.items()}

def process_files(routes_file, trips_file, stop_times_file):
    routes_df = parse_csv_file(routes_file)
    trips_df = parse_csv_file(trips_file)
    stop_times_df = parse_csv_file(stop_times_file)
    
    if 'route_id' not in routes_df.columns or 'trip_id' not in trips_df.columns:
        raise ValueError("CSV files must contain 'route_id' and 'trip_id' columns")
    if 'trip_id' not in stop_times_df.columns or 'stop_id' not in stop_times_df.columns:
        raise ValueError("stop_times.csv must contain 'trip_id' and 'stop_id' columns")

    route_trip_map = {}
    for route_id in routes_df['route_id'].unique():
        first_trip = trips_df[trips_df['route_id'] == route_id].iloc[0]
        route_trip_map[route_id] = first_trip['trip_id']
    
    route_stops_map = {}
    for route_id, trip_id in route_trip_map.items():
        stops = stop_times_df[stop_times_df['trip_id'] == trip_id]['stop_id'].tolist()
        route_stops_map[route_id] = stops
    
    route_trip_map = convert_keys_to_strings(route_trip_map)
    route_stops_map = convert_keys_to_strings(route_stops_map)
    
    return route_trip_map, route_stops_map

def save_to_json(data, filename):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=4)

routes_file = 'routes.csv'
trips_file = 'trips.csv'
stop_times_file = 'stop_times.csv'

try:
    route_trip_map, route_stops_map = process_files(routes_file, trips_file, stop_times_file)
    
    save_to_json(route_trip_map, 'route_trip_map.json')
    save_to_json(route_stops_map, 'route_stops_map.json')
    
except Exception as e:
    print(e)