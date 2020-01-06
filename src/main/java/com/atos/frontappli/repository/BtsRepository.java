package com.atos.frontappli.repository;

import com.atos.frontappli.domain.Bts;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Bts entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BtsRepository extends JpaRepository<Bts, Long> {

}
