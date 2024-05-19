package com.happyfood.reports.controller;

import com.happyfood.reports.entity.Reports;
import com.happyfood.reports.service.IReportsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reports")
public class ReportsController {
    private final IReportsService reportsService;

    @GetMapping
    public ResponseEntity<List<Reports>> getAllReports() {
        return ResponseEntity.ok(reportsService.getAllReports());
    }

    @PostMapping
    public ResponseEntity<Reports> createReport(@RequestBody Reports report) {
        return ResponseEntity.ok(reportsService.createReport(report));
    }

    @PutMapping("/{reportId}")
    public ResponseEntity<Reports> updateReport(@RequestHeader String role, @PathVariable Long reportId, @RequestBody Reports report) {
        if (!role.equals("ADMIN")) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(reportsService.updateReport(reportId, report));
    }
}
