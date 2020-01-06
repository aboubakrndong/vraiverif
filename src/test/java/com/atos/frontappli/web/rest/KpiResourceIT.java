package com.atos.frontappli.web.rest;

import com.atos.frontappli.FrontappliApp;
import com.atos.frontappli.domain.Kpi;
import com.atos.frontappli.repository.KpiRepository;
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
 * Integration tests for the {@link KpiResource} REST controller.
 */
@SpringBootTest(classes = FrontappliApp.class)
public class KpiResourceIT {

    private static final String DEFAULT_TAUXDAPPELS = "AAAAAAAAAA";
    private static final String UPDATED_TAUXDAPPELS = "BBBBBBBBBB";

    private static final String DEFAULT_TAUXDEPERTES = "AAAAAAAAAA";
    private static final String UPDATED_TAUXDEPERTES = "BBBBBBBBBB";

    private static final String DEFAULT_TAUXDEREJETS = "AAAAAAAAAA";
    private static final String UPDATED_TAUXDEREJETS = "BBBBBBBBBB";

    @Autowired
    private KpiRepository kpiRepository;

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

    private MockMvc restKpiMockMvc;

    private Kpi kpi;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final KpiResource kpiResource = new KpiResource(kpiRepository);
        this.restKpiMockMvc = MockMvcBuilders.standaloneSetup(kpiResource)
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
    public static Kpi createEntity(EntityManager em) {
        Kpi kpi = new Kpi()
            .tauxdappels(DEFAULT_TAUXDAPPELS)
            .tauxdepertes(DEFAULT_TAUXDEPERTES)
            .tauxderejets(DEFAULT_TAUXDEREJETS);
        return kpi;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Kpi createUpdatedEntity(EntityManager em) {
        Kpi kpi = new Kpi()
            .tauxdappels(UPDATED_TAUXDAPPELS)
            .tauxdepertes(UPDATED_TAUXDEPERTES)
            .tauxderejets(UPDATED_TAUXDEREJETS);
        return kpi;
    }

    @BeforeEach
    public void initTest() {
        kpi = createEntity(em);
    }

    @Test
    @Transactional
    public void createKpi() throws Exception {
        int databaseSizeBeforeCreate = kpiRepository.findAll().size();

        // Create the Kpi
        restKpiMockMvc.perform(post("/api/kpis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(kpi)))
            .andExpect(status().isCreated());

        // Validate the Kpi in the database
        List<Kpi> kpiList = kpiRepository.findAll();
        assertThat(kpiList).hasSize(databaseSizeBeforeCreate + 1);
        Kpi testKpi = kpiList.get(kpiList.size() - 1);
        assertThat(testKpi.getTauxdappels()).isEqualTo(DEFAULT_TAUXDAPPELS);
        assertThat(testKpi.getTauxdepertes()).isEqualTo(DEFAULT_TAUXDEPERTES);
        assertThat(testKpi.getTauxderejets()).isEqualTo(DEFAULT_TAUXDEREJETS);
    }

    @Test
    @Transactional
    public void createKpiWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = kpiRepository.findAll().size();

        // Create the Kpi with an existing ID
        kpi.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restKpiMockMvc.perform(post("/api/kpis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(kpi)))
            .andExpect(status().isBadRequest());

        // Validate the Kpi in the database
        List<Kpi> kpiList = kpiRepository.findAll();
        assertThat(kpiList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllKpis() throws Exception {
        // Initialize the database
        kpiRepository.saveAndFlush(kpi);

        // Get all the kpiList
        restKpiMockMvc.perform(get("/api/kpis?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(kpi.getId().intValue())))
            .andExpect(jsonPath("$.[*].tauxdappels").value(hasItem(DEFAULT_TAUXDAPPELS.toString())))
            .andExpect(jsonPath("$.[*].tauxdepertes").value(hasItem(DEFAULT_TAUXDEPERTES.toString())))
            .andExpect(jsonPath("$.[*].tauxderejets").value(hasItem(DEFAULT_TAUXDEREJETS.toString())));
    }
    
    @Test
    @Transactional
    public void getKpi() throws Exception {
        // Initialize the database
        kpiRepository.saveAndFlush(kpi);

        // Get the kpi
        restKpiMockMvc.perform(get("/api/kpis/{id}", kpi.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(kpi.getId().intValue()))
            .andExpect(jsonPath("$.tauxdappels").value(DEFAULT_TAUXDAPPELS.toString()))
            .andExpect(jsonPath("$.tauxdepertes").value(DEFAULT_TAUXDEPERTES.toString()))
            .andExpect(jsonPath("$.tauxderejets").value(DEFAULT_TAUXDEREJETS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingKpi() throws Exception {
        // Get the kpi
        restKpiMockMvc.perform(get("/api/kpis/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateKpi() throws Exception {
        // Initialize the database
        kpiRepository.saveAndFlush(kpi);

        int databaseSizeBeforeUpdate = kpiRepository.findAll().size();

        // Update the kpi
        Kpi updatedKpi = kpiRepository.findById(kpi.getId()).get();
        // Disconnect from session so that the updates on updatedKpi are not directly saved in db
        em.detach(updatedKpi);
        updatedKpi
            .tauxdappels(UPDATED_TAUXDAPPELS)
            .tauxdepertes(UPDATED_TAUXDEPERTES)
            .tauxderejets(UPDATED_TAUXDEREJETS);

        restKpiMockMvc.perform(put("/api/kpis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedKpi)))
            .andExpect(status().isOk());

        // Validate the Kpi in the database
        List<Kpi> kpiList = kpiRepository.findAll();
        assertThat(kpiList).hasSize(databaseSizeBeforeUpdate);
        Kpi testKpi = kpiList.get(kpiList.size() - 1);
        assertThat(testKpi.getTauxdappels()).isEqualTo(UPDATED_TAUXDAPPELS);
        assertThat(testKpi.getTauxdepertes()).isEqualTo(UPDATED_TAUXDEPERTES);
        assertThat(testKpi.getTauxderejets()).isEqualTo(UPDATED_TAUXDEREJETS);
    }

    @Test
    @Transactional
    public void updateNonExistingKpi() throws Exception {
        int databaseSizeBeforeUpdate = kpiRepository.findAll().size();

        // Create the Kpi

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKpiMockMvc.perform(put("/api/kpis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(kpi)))
            .andExpect(status().isBadRequest());

        // Validate the Kpi in the database
        List<Kpi> kpiList = kpiRepository.findAll();
        assertThat(kpiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteKpi() throws Exception {
        // Initialize the database
        kpiRepository.saveAndFlush(kpi);

        int databaseSizeBeforeDelete = kpiRepository.findAll().size();

        // Delete the kpi
        restKpiMockMvc.perform(delete("/api/kpis/{id}", kpi.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Kpi> kpiList = kpiRepository.findAll();
        assertThat(kpiList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Kpi.class);
        Kpi kpi1 = new Kpi();
        kpi1.setId(1L);
        Kpi kpi2 = new Kpi();
        kpi2.setId(kpi1.getId());
        assertThat(kpi1).isEqualTo(kpi2);
        kpi2.setId(2L);
        assertThat(kpi1).isNotEqualTo(kpi2);
        kpi1.setId(null);
        assertThat(kpi1).isNotEqualTo(kpi2);
    }
}
