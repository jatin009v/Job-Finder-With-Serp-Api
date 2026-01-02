const form = document.getElementById("jobForm");
const results = document.getElementById("results");
const loading = document.getElementById("loading");
const resultsHeader = document.getElementById("resultsHeader");
const noResults = document.getElementById("noResults");
const resultsCount = document.getElementById("resultsCount");
const jobCount = document.getElementById("job-count");
const companyCount = document.getElementById("company-count");
const locationCount = document.getElementById("location-count");

// Quick search tags
const quickTags = document.querySelectorAll('.quick-tag');
quickTags.forEach(tag => {
  tag.addEventListener('click', () => {
    const queryInput = document.getElementById('query');
    queryInput.value = tag.getAttribute('data-query');
    queryInput.focus();
    
    // Animate the tag
    tag.style.transform = 'scale(0.95)';
    setTimeout(() => {
      tag.style.transform = '';
    }, 200);
  });
});

// Animated stats counter
function animateStats() {
  const targets = {
    job: 1234,
    company: 512,
    location: 87
  };
  
  const duration = 2000; // 2 seconds
  const step = 50; // Update every 50ms
  
  let jobCurrent = 0;
  let companyCurrent = 0;
  let locationCurrent = 0;
  
  const jobIncrement = targets.job / (duration / step);
  const companyIncrement = targets.company / (duration / step);
  const locationIncrement = targets.location / (duration / step);
  
  const timer = setInterval(() => {
    jobCurrent += jobIncrement;
    companyCurrent += companyIncrement;
    locationCurrent += locationIncrement;
    
    if (jobCurrent >= targets.job) {
      jobCurrent = targets.job;
      companyCurrent = targets.company;
      locationCurrent = targets.location;
      clearInterval(timer);
    }
    
    jobCount.textContent = Math.floor(jobCurrent) + "+";
    companyCount.textContent = Math.floor(companyCurrent) + "+";
    locationCount.textContent = Math.floor(locationCurrent) + "+";
  }, step);
}

// Initialize stats animation
window.addEventListener('load', () => {
  setTimeout(animateStats, 1000);
});

// Form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = document.getElementById("query").value.trim();

  if (!query) {
    // Shake animation for empty input
    const input = document.getElementById("query");
    input.style.animation = 'shake 0.5s';
    input.focus();
    setTimeout(() => {
      input.style.animation = '';
    }, 500);
    return;
  }
  
  // Clear previous results
  results.innerHTML = "";
  noResults.classList.add("hidden");
  resultsHeader.classList.add("hidden");
  
  // Show loading
  loading.classList.remove("hidden");
  
  // Scroll to results
  document.querySelector('.results-section').scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });

  const url = `http://localhost:5000/api/jobs?q=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    // Hide loading
    loading.classList.add("hidden");
    
    if (!data.jobs_results || data.jobs_results.length === 0) {
      noResults.classList.remove("hidden");
      resultsHeader.classList.add("hidden");
    } else {
      // Show results header with count
      resultsCount.textContent = data.jobs_results.length;
      resultsHeader.classList.remove("hidden");
      
      // Add animation delay for each card
      data.jobs_results.forEach((job, index) => {
        setTimeout(() => {
          const div = document.createElement("div");
          div.className = "job-card";
          div.style.animationDelay = `${index * 0.1}s`;
          
          // Format description to remove HTML tags if any
          let description = job.description || "No description available.";
          description = description.replace(/<[^>]*>/g, '');
          
          // Determine job type for styling
          const jobType = job.detected_extensions?.schedule_type || "Full-time";
          const postedDate = job.detected_extensions?.posted_at || "Recently";
          
          div.innerHTML = `
            <h3>${job.title}</h3>
            <p class="company"><i class="fas fa-building"></i> ${job.company_name || "Unknown Company"}</p>
            <p class="location"><i class="fas fa-map-marker-alt"></i> ${job.location || "Location not specified"}</p>
            <p class="desc">${description.substring(0, 180)}...</p>
            <div class="job-meta">
              <span class="job-type">${jobType}</span>
              <span class="posted">${postedDate}</span>
            </div>
            ${
              job.apply_options && job.apply_options.length > 0
                ? `<a href="${job.apply_options[0].link}" target="_blank" class="apply-btn">Apply Now <i class="fas fa-external-link-alt"></i></a>`
                : '<button class="apply-btn" disabled>Apply Details Not Available</button>'
            }
          `;
          results.appendChild(div);
          
          // Add hover effect listeners
          const applyBtn = div.querySelector('.apply-btn');
          if (applyBtn && !applyBtn.disabled) {
            applyBtn.addEventListener('mouseenter', () => {
              applyBtn.innerHTML = 'Apply Now <i class="fas fa-paper-plane"></i>';
            });
            applyBtn.addEventListener('mouseleave', () => {
              applyBtn.innerHTML = 'Apply Now <i class="fas fa-external-link-alt"></i>';
            });
          }
        }, index * 100);
      });
    }
  } catch (error) {
    console.error(error);
    loading.classList.add("hidden");
    noResults.classList.remove("hidden");
    noResults.innerHTML = `
      <div class="no-results-icon">
        <i class="fas fa-exclamation-triangle fa-2x"></i>
      </div>
      <h3>Connection Error</h3>
      <p>Unable to fetch jobs. Please check your connection and try again.</p>
      <button class="retry-btn" onclick="window.location.reload()">Retry</button>
    `;
  }
});

// Retry button in no results
document.querySelector('.retry-btn')?.addEventListener('click', () => {
  document.getElementById('query').focus();
});

// Add shake animation for empty input
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);