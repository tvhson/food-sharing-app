package com.happyfood.reports.repository;

import com.happyfood.reports.entity.Reports;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportsRepository extends JpaRepository<Reports, Long>{
}
