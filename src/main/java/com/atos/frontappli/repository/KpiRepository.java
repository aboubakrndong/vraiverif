package com.atos.frontappli.repository;

import com.atos.frontappli.domain.Kpi;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Kpi entity.
 */
@SuppressWarnings("unused")
@Repository
public interface KpiRepository extends JpaRepository<Kpi, Long> {

}
