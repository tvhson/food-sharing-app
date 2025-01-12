package com.happyfood.notifications.service.impl;

import com.happyfood.notifications.entity.Reports;
import com.happyfood.notifications.exception.CustomException;
import com.happyfood.notifications.repository.ReportsRepository;
import com.happyfood.notifications.service.IReportsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportsServiceImpl implements IReportsService {
    private final ReportsRepository reportsRepository;

    @Override
    public List<Reports> getAllReports() {
        List<Reports> reports = reportsRepository.findAll();

        Collections.reverse(reports);

        return reports;
    }

    @Override
    public Reports createReport(Reports report) {
        report.setStatus("PENDING");
        report.setCreatedDate(new Date());
        return reportsRepository.save(report);
    }

    @Override
    public Reports updateReport(Long reportId, Reports report) {
        Reports existingReport = reportsRepository.findById(reportId).orElseThrow(() -> new CustomException("Không tìm thấy report", HttpStatus.NOT_FOUND));
        existingReport.setTitle(report.getTitle());
        existingReport.setDescription(report.getDescription());
        existingReport.setImageUrl(report.getImageUrl());
        existingReport.setStatus(report.getStatus());
        existingReport.setCreatedDate(report.getCreatedDate());
        existingReport.setLinkId(report.getLinkId());
        existingReport.setNote(report.getNote());
        existingReport.setType(report.getType());
        return reportsRepository.save(existingReport);
    }
}
