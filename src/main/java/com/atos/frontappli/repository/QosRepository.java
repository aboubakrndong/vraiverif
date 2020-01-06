package com.atos.frontappli.repository;

import com.atos.frontappli.domain.Qos;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Qos entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QosRepository extends JpaRepository<Qos, Long> {

}
