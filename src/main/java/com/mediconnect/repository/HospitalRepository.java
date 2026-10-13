package com.mediconnect.repository;

import com.mediconnect.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    @Query("SELECT h FROM Hospital h WHERE " +
           "(:query IS NULL OR :query = '' OR LOWER(h.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(h.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(h.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:department IS NULL OR :department = '' OR LOWER(h.department) LIKE LOWER(CONCAT('%', :department, '%')))")
    List<Hospital> searchHospitals(
            @Param("query") String query,
            @Param("location") String location,
            @Param("department") String department
    );

    List<Hospital> findByLocationContainingIgnoreCase(String location);

    List<Hospital> findByDepartmentContainingIgnoreCase(String department);
}
