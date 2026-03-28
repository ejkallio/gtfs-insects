package com.yourcompany.myapp.controller;

import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.google.transit.realtime.GtfsRealtime;
import com.google.transit.realtime.GtfsRealtime.FeedMessage;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:5173")
public class VehiclePositionController {

    private static final String GTFS_REALTIME_URL = "https://opendatavilkku.mattersoft.fi/rtapi/gtfsrealtime/v1.0/feed/vehicleposition";
    private static final String API_USERNAME = System.getenv("GTFS_USER");
    private static final String API_PASSWORD = System.getenv("GTFS_PASSWORD");

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/positions")
    public ResponseEntity<?> getVehiclePositions() {
        try {
            // Create Basic Auth header
            String credentials = API_USERNAME + ":" + API_PASSWORD;
            String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Basic " + encodedCredentials);
            
            HttpEntity<?> entity = new HttpEntity<>(headers);
            
            // Fetch from external API as byte array
            ResponseEntity<byte[]> response = restTemplate.exchange(GTFS_REALTIME_URL, org.springframework.http.HttpMethod.GET, entity, byte[].class);
            
            if (response.getBody() == null) {
                return ResponseEntity.noContent().build();
            }
            
            // Decode protobuf
            FeedMessage feed = FeedMessage.parseFrom(response.getBody());
            
            // Convert to JSON-friendly format
            List<Map<String, Object>> vehicles = new ArrayList<>();
            for (GtfsRealtime.FeedEntity entity2 : feed.getEntityList()) {
                if (entity2.hasVehicle()) {
                    GtfsRealtime.VehiclePosition vp = entity2.getVehicle();
                    if (vp.hasPosition()) {
                        Map<String, Object> vehicle = new HashMap<>();
                        vehicle.put("id", entity2.getId());
                        vehicle.put("vehicleId", vp.getVehicle().getId());
                        vehicle.put("label", vp.getVehicle().getLabel());
                        vehicle.put("licensePlate", vp.getVehicle().getLicensePlate());
                        vehicle.put("latitude", vp.getPosition().getLatitude());
                        vehicle.put("longitude", vp.getPosition().getLongitude());
                        vehicle.put("bearing", vp.getPosition().getBearing());
                        vehicle.put("speed", vp.getPosition().getSpeed());
                        vehicle.put("tripId", vp.getTrip().getTripId());
                        vehicle.put("routeId", vp.getTrip().getRouteId());
                        vehicle.put("currentStatus", vp.getCurrentStatus().toString());
                        vehicles.add(vehicle);
                    }
                }
            }
            
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching vehicle positions: " + e.getMessage());
        }
    }
}

