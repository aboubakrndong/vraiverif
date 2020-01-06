package com.atos.frontappli.web.rest;

import com.atos.frontappli.FrontappliApp;
import com.atos.frontappli.domain.Zones;
import com.atos.frontappli.repository.ZonesRepository;
import com.atos.frontappli.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;

import static com.atos.frontappli.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link ZonesResource} REST controller.
 */
@SpringBootTest(classes = FrontappliApp.class)
public class ZonesResourceIT {

    private static final String DEFAULT_NOMZONE = "AAAAAAAAAA";
    private static final String UPDATED_NOMZONE = "BBBBBBBBBB";

    private static final String DEFAULT_COUVERTURE = "AAAAAAAAAA";
    private static final String UPDATED_COUVERTURE = "BBBBBBBBBB";

    private static final String DEFAULT_CADASTRE = "AAAAAAAAAA";
    private static final String UPDATED_CADASTRE = "BBBBBBBBBB";

    private static final String DEFAULT_POPULATION = "AAAAAAAAAA";
    private static final String UPDATED_POPULATION = "BBBBBBBBBB";

    @Autowired
    private ZonesRepository zonesRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restZonesMockMvc;

    private Zones zones;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ZonesResource zonesResource = new ZonesResource(zonesRepository);
        this.restZonesMockMvc = MockMvcBuilders.standaloneSetup(zonesResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Zones createEntity(EntityManager em) {
        Zones zones = new Zones()
            .nomzone(DEFAULT_NOMZONE)
            .couverture(DEFAULT_COUVERTURE)
            .cadastre(DEFAULT_CADASTRE)
            .population(DEFAULT_POPULATION);
        return zones;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Zones createUpdatedEntity(EntityManager em) {
        Zones zones = new Zones()
            .nomzone(UPDATED_NOMZONE)
            .couverture(UPDATED_COUVERTURE)
            .cadastre(UPDATED_CADASTRE)
            .population(UPDATED_POPULATION);
        return zones;
    }

    @BeforeEach
    public void initTest() {
        zones = createEntity(em);
    }

    @Test
    @Transactional
    public void createZones() throws Exception {
        int databaseSizeBeforeCreate = zonesRepository.findAll().size();

        // Create the Zones
        restZonesMockMvc.perform(post("/api/zones")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(zones)))
            .andExpect(status().isCreated());

        // Validate the Zones in the database
        List<Zones> zonesList = zonesRepository.findAll();
        assertThat(zonesList).hasSize(databaseSizeBeforeCreate + 1);
        Zones testZones = zonesList.get(zonesList.size() - 1);
        assertThat(testZones.getNomzone()).isEqualTo(DEFAULT_NOMZONE);
        assertThat(testZones.getCouverture()).isEqualTo(DEFAULT_COUVERTURE);
        assertThat(testZones.getCadastre()).isEqualTo(DEFAULT_CADASTRE);
        assertThat(testZones.getPopulation()).isEqualTo(DEFAULT_POPULATION);
    }

    @Test
    @Transactional
    public void createZonesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = zonesRepository.findAll().size();

        // Create the Zones with an existing ID
        zones.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restZonesMockMvc.perform(post("/api/zones")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(zones)))
            .andExpect(status().isBadRequest());

        // Validate the Zones in the database
        List<Zones> zonesList = zonesRepository.findAll();
        assertThat(zonesList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllZones() throws Exception {
        // Initialize the database
        zonesRepository.saveAndFlush(zones);

        // Get all the zonesList
        restZonesMockMvc.perform(get("/api/zones?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(zones.getId().intValue())))
            .andExpect(jsonPath("$.[*].nomzone").value(hasItem(DEFAULT_NOMZONE.toString())))
            .andExpect(jsonPath("$.[*].couverture").value(hasItem(DEFAULT_COUVERTURE.toString())))
            .andExpect(jsonPath("$.[*].cadastre").value(hasItem(DEFAULT_CADASTRE.toString())))
            .andExpect(jsonPath("$.[*].population").value(hasItem(DEFAULT_POPULATION.toString())));
    }
    
    @Test
    @Transactional
    public void getZones() throws Exception {
        // Initialize the database
        zonesRepository.saveAndFlush(zones);

        // Get the zones
        restZonesMockMvc.perform(get("/api/zones/{id}", zones.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(zones.getId().intValue()))
            .andExpect(jsonPath("$.nomzone").value(DEFAULT_NOMZONE.toString()))
            .andExpect(jsonPath("$.couverture").value(DEFAULT_COUVERTURE.toString()))
            .andExpect(jsonPath("$.cadastre").value(DEFAULT_CADASTRE.toString()))
            .andExpect(jsonPath("$.population").value(DEFAULT_POPULATION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingZones() throws Exception {
        // Get the zones
        restZonesMockMvc.perform(get("/api/zones/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateZones() throws Exception {
        // Initialize the database
        zonesRepository.saveAndFlush(zones);

        int databaseSizeBeforeUpdate = zonesRepository.findAll().size();

        // Update the zones
        Zones updatedZones = zonesRepository.findById(zones.getId()).get();
        // Disconnect from session so that the updates on updatedZones are not directly saved in db
        em.detach(updatedZones);
        updatedZones
            .nomzone(UPDATED_NOMZONE)
            .couverture(UPDATED_COUVERTURE)
            .cadastre(UPDATED_CADASTRE)
            .population(UPDATED_POPULATION);

        restZonesMockMvc.perform(put("/api/zones")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedZones)))
            .andExpect(status().isOk());

        // Validate the Zones in the database
        List<Zones> zonesList = zonesRepository.findAll();
        assertThat(zonesList).hasSize(databaseSizeBeforeUpdate);
        Zones testZones = zonesList.get(zonesList.size() - 1);
        assertThat(testZones.getNomzone()).isEqualTo(UPDATED_NOMZONE);
        assertThat(testZones.getCouverture()).isEqualTo(UPDATED_COUVERTURE);
        assertThat(testZones.getCadastre()).isEqualTo(UPDATED_CADASTRE);
        assertThat(testZones.getPopulation()).isEqualTo(UPDATED_POPULATION);
    }

    @Test
    @Transactional
    public void updateNonExistingZones() throws Exception {
        int databaseSizeBeforeUpdate = zonesRepository.findAll().size();

        // Create the Zones

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restZonesMockMvc.perform(put("/api/zones")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(zones)))
            .andExpect(status().isBadRequest());

        // Validate the Zones in the database
        List<Zones> zonesList = zonesRepository.findAll();
        assertThat(zonesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteZones() throws Exception {
        // Initialize the database
        zonesRepository.saveAndFlush(zones);

        int databaseSizeBeforeDelete = zonesRepository.findAll().size();

        // Delete the zones
        restZonesMockMvc.perform(delete("/api/zones/{id}", zones.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Zones> zonesList = zonesRepository.findAll();
        assertThat(zonesList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Zones.class);
        Zones zones1 = new Zones();
        zones1.setId(1L);
        Zones zones2 = new Zones();
        zones2.setId(zones1.getId());
        assertThat(zones1).isEqualTo(zones2);
        zones2.setId(2L);
        assertThat(zones1).isNotEqualTo(zones2);
        zones1.setId(null);
        assertThat(zones1).isNotEqualTo(zones2);
    }
}
