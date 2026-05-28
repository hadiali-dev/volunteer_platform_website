import { render, screen } from "@testing-library/react";

import { AnnouncementBanner } from "@/features/dashboard/components/AnnouncementBanner";
import type { Announcement } from "@/features/dashboard/schemas";

const mockAnnouncement: Announcement = {
  _id: "announcement-1",
  title: "Platform Launch",
  description: "A brand-new volunteer platform is now live.",
  backgroundImage: "https://example.com/banner.jpg",
  ctaUrl: "https://example.com/details",
  ctaLabel: "Read more",
  isActive: true,
  createdAt: "2026-04-20T10:00:00.000Z",
  updatedAt: "2026-04-20T10:00:00.000Z",
};

describe("AnnouncementBanner", () => {
  it("renders announcement content and CTA link", () => {
    render(<AnnouncementBanner announcement={mockAnnouncement} isLoading={false} />);

    expect(
      screen.getByRole("heading", { level: 3, name: "Platform Launch" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("A brand-new volunteer platform is now live."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read more" })).toHaveAttribute(
      "href",
      "https://example.com/details",
    );
  });

  it("does not render a CTA link when ctaUrl is missing", () => {
    const withoutUrl: Announcement = { ...mockAnnouncement, ctaUrl: undefined };

    render(<AnnouncementBanner announcement={withoutUrl} isLoading={false} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});

