package com.atos.frontappli.repository;

import com.atos.frontappli.domain.Technicien;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Technicien entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TechnicienRepository extends JpaRepository<Technicien, Long> {

}
