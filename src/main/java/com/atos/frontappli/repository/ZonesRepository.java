package com.atos.frontappli.repository;

import com.atos.frontappli.domain.Zones;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Zones entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ZonesRepository extends JpaRepository<Zones, Long> {

}
