import pandas as pd
import json

stop_df = pd.read_csv('stops.csv')

stop_id_to_lat_lon = stop_df.set_index('stop_id')[['stop_lat', 'stop_lon']].to_dict(orient='index')

with open('route_stops_map.json', 'r') as f:
    route_stops_map = json.load(f)

updated_route_stops_map = {}

for route_id, stop_ids in route_stops_map.items():
    updated_stops = []
    for stop_id in stop_ids:
        if stop_id in stop_id_to_lat_lon:
            lat_lon = stop_id_to_lat_lon[stop_id]
            updated_stops.append({
                'stop_id': stop_id,
                'latitude': lat_lon['stop_lat'],
                'longitude': lat_lon['stop_lon']
            })
    updated_route_stops_map[route_id] = updated_stops

with open('updated_route_stops_map.json', 'w') as f:
    json.dump(updated_route_stops_map, f, indent=4)
