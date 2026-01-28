import React from "react";

type ICPProfileLayoutProps = {
  headerLeft: React.ReactNode;
  headerRight?: React.ReactNode;
  profileCardTopRow?: React.ReactNode;
  profileMain: React.ReactNode;
  footerCta?: React.ReactNode;
};

export function ICPProfileLayout({
  headerLeft,
  headerRight,
  profileCardTopRow,
  profileMain,
  footerCta,
}: ICPProfileLayoutProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>{headerLeft}</div>
        {headerRight ? (
          <div className="flex items-center gap-3 flex-wrap">{headerRight}</div>
        ) : null}
      </div>

      <div className="bg-background border border-black rounded-design p-8 shadow-md space-y-6">
        {profileCardTopRow ? <div>{profileCardTopRow}</div> : null}
        <div>{profileMain}</div>
      </div>

      {footerCta ? (
        <div className="bg-background border border-black rounded-design p-6 shadow-md">
          {footerCta}
        </div>
      ) : null}
    </div>
  );
}
