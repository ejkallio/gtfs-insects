package com.yourcompany.myapp.controller;


import com.yourcompany.myapp.service.StopService;
import com.yourcompany.myapp.service.StopService.GtfsStop;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;

@RestController
@RequestMapping("/api/stops")
public class StopController {
	private final StopService stopService;

	public StopController(StopService stopService) {
		this.stopService = stopService;
	}

	@GetMapping
	public List<GtfsStop> getAllStops() {
		return stopService.getAllStops();
	}
}
