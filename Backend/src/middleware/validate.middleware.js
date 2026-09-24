const validate = (schema) => (req, res, next) => {
  try {
    const payload = req.body || {};
    const result = schema.safeParse(payload);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const errorMessage = firstIssue
        ? `${firstIssue.path.join(".") || "Field"}: ${firstIssue.message}`
        : "Validation failed";

      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    req.body = result.data;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error during validation"
    });
  }
};

module.exports = { validate };
