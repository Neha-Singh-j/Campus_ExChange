const memoryStore = require('../utils/memoryStore');

// GET /api/search
exports.searchCatalog = async (req, res, next) => {
  try {
    const {
      q,
      course,
      department,
      maxPrice,
      condition,
      verifiedOnly,
      sameDay,
      sort
    } = req.query;

    let results = [...memoryStore.searchResults];

    if (q) {
      const queryStr = q.toLowerCase();
      results = results.filter(
        item =>
          item.title.toLowerCase().includes(queryStr) ||
          item.desc.toLowerCase().includes(queryStr) ||
          (item.courseCode && item.courseCode.toLowerCase().includes(queryStr))
      );
    }

    if (course && course !== 'All') {
      results = results.filter(
        item => !item.courseCode || item.courseCode.toLowerCase() === course.toLowerCase()
      );
    }

    if (department && department !== 'All') {
      results = results.filter(
        item => !item.department || item.department.toLowerCase().includes(department.toLowerCase())
      );
    }

    if (maxPrice) {
      const max = Number(maxPrice);
      if (!isNaN(max)) {
        results = results.filter(item => item.price <= max);
      }
    }

    if (condition && condition !== 'Any') {
      results = results.filter(item => item.condition === condition);
    }

    if (verifiedOnly === 'true') {
      results = results.filter(item => item.verifiedEdu);
    }

    if (sameDay === 'true') {
      results = results.filter(item => item.sameDay);
    }

    if (sort === 'Price: Low to High') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'Price: High to Low') {
      results.sort((a, b) => b.price - a.price);
    } else if (sort === 'Distance') {
      results.sort((a, b) => parseFloat(a.dist) - parseFloat(b.dist));
    }

    res.status(200).json({
      success: true,
      syllabusVerified: true,
      courseCatalogSynced: 'Spring 2025 Regular Session',
      instructor: 'Prof. Jennifer Doudna & Staff',
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error);
  }
};
