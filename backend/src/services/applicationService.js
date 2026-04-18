const Application = require('../models/application');
const Notification = require('../models/Notification');
const Opportunity = require('../models/opportunity');
const VolunteerProfile = require('../models/volunteerProfile');
const AppError = require('../utils/AppError');

class ApplicationService {
  static async apply(volunteerId, opportunityId) {
    const opportunity = await Opportunity.findById(opportunityId);
    if (
      !opportunity ||
      opportunity.status !== 'open' ||
      opportunity.approvalStatus !== 'approved'
    ) {
      throw new AppError('Opportunity not found or unavailable', 404);
    }

    const existingApplication = await Application.findOne({
      volunteer: volunteerId,
      opportunity: opportunityId,
    });

    if (existingApplication) {
      throw new AppError('You already applied for this opportunity', 400);
    }

    return Application.create({ volunteer: volunteerId, opportunity: opportunityId });
  }

  static async getMyApplications(volunteerId, { skip = 0, limit = 10 } = {}) {
    const data = await Application.find({ volunteer: volunteerId })
      .skip(skip)
      .limit(limit)
      .sort({ appliedAt: -1 })
      .populate({
        path: 'opportunity',
        populate: {
          path: 'organization',
          select: 'name email role image active createdAt updatedAt',
        },
      });

    const total = await Application.countDocuments({ volunteer: volunteerId });

    return { data, total };
  }

  static async getAllApplications({ skip = 0, limit = 10 } = {}) {
    const data = await Application.find()
      .skip(skip)
      .limit(limit)
      .sort({ appliedAt: -1 })
      .populate('volunteer', 'name email role image active createdAt updatedAt')
      .populate({
        path: 'opportunity',
        populate: {
          path: 'organization',
          select: 'name email role image active createdAt updatedAt',
        },
      });

    const total = await Application.countDocuments();

    return { data, total };
  }

  static async updateStatus(appId, status) {
    const app = await Application.findById(appId).populate('opportunity');
    if (!app) {
      throw new AppError('Application not found', 404);
    }

    app.status = status;
    await app.save();

    if (status === 'accepted') {
      await VolunteerProfile.findOneAndUpdate(
        { user: app.volunteer },
        { $inc: { totalHours: app.opportunity.hours || 0 } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    if (status === 'accepted' || status === 'rejected') {
      await Notification.create({
        user: app.volunteer,
        message:
          status === 'accepted'
            ? `You were accepted for "${app.opportunity.title}".`
            : `Your application for "${app.opportunity.title}" was rejected.`,
      });
    }

    return Application.findById(appId)
      .populate('volunteer', 'name email role image active createdAt updatedAt')
      .populate({
        path: 'opportunity',
        populate: {
          path: 'organization',
          select: 'name email role image active createdAt updatedAt',
        },
      });
  }
}

module.exports = ApplicationService;
