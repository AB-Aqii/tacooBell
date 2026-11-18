import { ImageResponse } from "next/og";

type OgImageInput = {
  title: string;
  subtitle?: string;
};

export function renderOgImage({ title, subtitle }: OgImageInput) {
  const titleSize = title.length > 70 ? 52 : title.length > 40 ? 64 : 78;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#14213D",
        color: "#FFFFFF",
        padding: "72px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            width: 28,
            height: 28,
            borderRadius: 14,
            background: "#FFFFFF",
          }}
        />
        <div
          style={{
            display: "flex",
            width: 28,
            height: 28,
            borderRadius: 14,
            background: "#F2A900",
            marginLeft: -10,
          }}
        />
        <div style={{ display: "flex", fontSize: 30, fontWeight: 700, marginLeft: 20 }}>
          Global Food Group
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: titleSize, fontWeight: 700, lineHeight: 1.1 }}>
          {title}
        </div>
        {subtitle ? (
          <div style={{ display: "flex", fontSize: 32, marginTop: 24, color: "#D5DAE5" }}>
            {subtitle}
          </div>
        ) : null}
      </div>
      <div style={{ display: "flex", width: 160, height: 8, background: "#F2A900" }} />
    </div>,
    { width: 1200, height: 630 },
  );
}
