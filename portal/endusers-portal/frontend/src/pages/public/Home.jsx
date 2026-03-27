import React, { useState } from 'react';
import jobsData from '../../data/jobs.json';
import './Home.css';

const facetConfig = [
  { key: 'location', label: 'Location' },
  { key: 'workMode', label: 'Work Mode' },
  { key: 'type', label: 'Job Type' },
  { key: 'experienceLevel', label: 'Experience' },
  { key: 'department', label: 'Function' },
];

const initialFilters = facetConfig.reduce((accumulator, facet) => {
  accumulator[facet.key] = [];
  return accumulator;
}, {});

const facetOptions = facetConfig.reduce((accumulator, facet) => {
  accumulator[facet.key] = [...new Set(jobsData.map((job) => job[facet.key]))].sort((left, right) => (
    left.localeCompare(right)
  ));
  return accumulator;
}, {});

function matchesSearch(job, query) {
  if (!query.trim()) return true;

  const haystack = [
    job.title,
    job.company,
    job.location,
    job.workMode,
    job.type,
    job.experienceLevel,
    job.department,
    job.salary,
    job.description,
    ...(job.skills || []),
  ].join(' ').toLowerCase();

  return haystack.includes(query.trim().toLowerCase());
}

function matchesFilters(job, filters) {
  return facetConfig.every((facet) => {
    const selectedValues = filters[facet.key];
    return selectedValues.length === 0 || selectedValues.includes(job[facet.key]);
  });
}

function getFacetCount(jobs, query, filters, key, value) {
  return jobs.filter((job) => {
    if (!matchesSearch(job, query)) return false;
    if (job[key] !== value) return false;

    return facetConfig.every((facet) => {
      if (facet.key === key) return true;
      const selectedValues = filters[facet.key];
      return selectedValues.length === 0 || selectedValues.includes(job[facet.key]);
    });
  }).length;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);

  const filteredJobs = jobsData.filter((job) => matchesSearch(job, query) && matchesFilters(job, filters));
  const activeFilters = facetConfig.flatMap((facet) => (
    filters[facet.key].map((value) => ({ key: facet.key, label: facet.label, value }))
  ));

  const toggleFilter = (key, value) => {
    setFilters((current) => {
      const isSelected = current[key].includes(value);
      return {
        ...current,
        [key]: isSelected
          ? current[key].filter((item) => item !== value)
          : [...current[key], value],
      };
    });
  };

  const clearAllFilters = () => {
    setQuery('');
    setFilters(initialFilters);
  };

  return (
    <div className="home-search-page">
      <section className="home-search-hero">
        <div className="home-search-copy">
          <span className="home-search-eyebrow">Job Search</span>
          <h1>Find your dream job.</h1>
        </div>

        <div className="home-search-box">
          <label className="search-label" htmlFor="job-search-input">Search jobs</label>
          <input
            id="job-search-input"
            className="search-input"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by role, company, skill, or keyword"
          />
          <div className="search-meta">
            <span>{filteredJobs.length} roles match your search</span>
            <span>{jobsData.length} jobs in the local dataset</span>
          </div>
        </div>
      </section>

      <section className="home-search-layout">
        <aside className="filter-panel">
          <div className="filter-panel-header">
            <div>
              <p className="filter-title">Filters</p>
              <p className="filter-subtitle">Faceted search for the mock job dataset.</p>
            </div>
            <button type="button" className="clear-button" onClick={clearAllFilters}>
              Clear all
            </button>
          </div>

          {facetConfig.map((facet) => (
            <div className="filter-group" key={facet.key}>
              <h2>{facet.label}</h2>
              <div className="filter-options">
                {facetOptions[facet.key].map((option) => {
                  const count = getFacetCount(jobsData, query, filters, facet.key, option);
                  const checked = filters[facet.key].includes(option);

                  return (
                    <label className="filter-option" key={option}>
                      <span className="filter-option-main">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFilter(facet.key, option)}
                        />
                        <span>{option}</span>
                      </span>
                      <span className="filter-count">{count}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        <div className="results-panel">
          <div className="results-toolbar">
            <div>
              <p className="results-title">Open Roles</p>
              <p className="results-subtitle">
                Showing {filteredJobs.length} of {jobsData.length} locally generated listings.
              </p>
            </div>
            <div className="results-chip-row">
              {query.trim() && (
                <span className="result-chip">
                  Keyword: {query.trim()}
                </span>
              )}
              {activeFilters.map((filter) => (
                <button
                  type="button"
                  key={`${filter.key}-${filter.value}`}
                  className="result-chip result-chip-button"
                  onClick={() => toggleFilter(filter.key, filter.value)}
                >
                  {filter.label}: {filter.value}
                </button>
              ))}
            </div>
          </div>

          <div className="results-scroll">
            {filteredJobs.length === 0 ? (
              <div className="empty-state">
                <h3>No jobs match the current filters.</h3>
                <p>Try clearing one or more facets or broadening the search keyword.</p>
              </div>
            ) : (
              <div className="results-grid">
                {filteredJobs.map((job) => (
                  <article className="job-card" key={job.id}>
                    <div className="job-card-top">
                      <div>
                        <p className="job-company">{job.company}</p>
                        <h3>{job.title}</h3>
                      </div>
                      <span className="job-salary">{job.salary}</span>
                    </div>

                    <div className="job-meta-row">
                      <span>{job.location}</span>
                      <span>{job.workMode}</span>
                      <span>{job.type}</span>
                    </div>

                    <div className="job-meta-row job-meta-secondary">
                      <span>{job.experienceLevel}</span>
                      <span>{job.department}</span>
                      <span>Posted {job.postedDaysAgo}d ago</span>
                    </div>

                    <p className="job-description">{job.description}</p>

                    <div className="job-skills">
                      {job.skills.map((skill) => (
                        <span className="skill-pill" key={`${job.id}-${skill}`}>{skill}</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
