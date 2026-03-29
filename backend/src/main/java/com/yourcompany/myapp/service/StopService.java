package com.yourcompany.myapp.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Arrays;

@Service
public class StopService {
    public static class GtfsStop {
        public String id;
        public String code;
        public String name;
        public double lat;
        public double lon;

        public GtfsStop(String id, String code, String name, double lat, double lon) {
            this.id = id;
            this.code = code;
            this.name = name;
            this.lat = lat;
            this.lon = lon;
        }
    }

    private static final List<GtfsStop> sampleStops = Arrays.asList(
        new GtfsStop("24254", "4800", "Kaavi MH", 62.9756, 28.4804),
        new GtfsStop("24508", "2300", "Siilinjärvi", 63.075297156962, 27.658543203704937)
    );

    public List<GtfsStop> getAllStops() {
        return sampleStops;
    }
}
