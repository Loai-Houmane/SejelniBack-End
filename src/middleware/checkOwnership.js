const AgencyService = require("../services/agencyService");

const checkOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const agencyId = req.user.id;

      let resource;
      switch (resourceType) {
        case "lead":
          resource = await AgencyService.getLeadById(resourceId);
          break;
        case "offer":
          resource = await AgencyService.getOfferById(resourceId);
          break;
        case "service":
          resource = await AgencyService.getServiceById(resourceId);
          break;
          case "agency":
          resource = await AgencyService.getAgencyById(resourceId);
          if(resource.id === agencyId){
            return next();
          }
          break;
        // Add more cases for other resources as needed
        default:
          return res.status(400).json({ message: "Invalid resource type" });
      }

      if (resource.agencyId !== agencyId) {
        return res.status(403).json({ message: "Forbidden: Resource does not belong to the agency" });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

module.exports = checkOwnership;