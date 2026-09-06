import React from "react";

/*
  Reusable Indian ornamental pattern.

  Inspired by:
  - Indian floral invitation motifs
  - hand-drawn leaf/vine patterns
  - radial floral symmetry
  - jaali / textile ornamentation

  Variants:
  "floral"  → detailed radial floral ornament
  "corner"  → cropped corner decoration
  "divider" → small horizontal ornament
*/

export default function IndianOrnament({
  variant = "floral",
  className = "",
  color = "#234236",
  opacity = 0.12,
  spin = variant !== "divider",
  reverse = false,
  duration,
}) {
  // Continuous, extremely slow rotation. transform-origin stays centered on
  // the element's own box so it turns gracefully in place, never dragging
  // surrounding content with it. Only decorative ornaments ever get this
  // class — never applied to page content.
  //
  // The spin animation lives on an inner wrapper, kept separate from the
  // outer element that receives `className` (positioning, sizing, and any
  // static orientation like a `rotate-180` utility). That way a fixed
  // orientation and a continuous spin can coexist without one overwriting
  // the other's `transform`.
  const spinClass = spin ? (reverse ? "mandala-spin-reverse" : "mandala-spin") : "";
  const spinStyle = spin
    ? {
        width: "100%",
        height: "100%",
        transformOrigin: "50% 50%",
        ...(duration ? { animationDuration: `${duration}s` } : {}),
      }
    : { width: "100%", height: "100%" };
  const rootClassName = className;

  const wrapSpin = (svg) =>
    spin ? (
      <div className={spinClass} style={spinStyle}>
        {svg}
      </div>
    ) : (
      svg
    );

  if (variant === "divider") {
    return (
      <svg
        viewBox="0 0 500 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <g
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={opacity}
        >
          {/* central flower */}
          <circle cx="250" cy="45" r="5" />
          <circle cx="250" cy="45" r="12" />

          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <ellipse
              key={angle}
              cx="250"
              cy="28"
              rx="7"
              ry="17"
              transform={`rotate(${angle} 250 45)`}
            />
          ))}

          {/* left vine */}
          <path d="M238 45 C215 45 210 30 190 30 C170 30 165 45 145 45" />
          <path d="M238 45 C215 45 207 59 187 59 C169 59 163 45 145 45" />

          {/* right vine */}
          <path d="M262 45 C285 45 290 30 310 30 C330 30 335 45 355 45" />
          <path d="M262 45 C285 45 293 59 313 59 C331 59 337 45 355 45" />

          {/* leaves */}
          <path d="M205 34 C198 24 187 24 181 30 C188 38 198 39 205 34Z" />
          <path d="M205 56 C198 66 187 66 181 60 C188 52 198 51 205 56Z" />

          <path d="M295 34 C302 24 313 24 319 30 C312 38 302 39 295 34Z" />
          <path d="M295 56 C302 66 313 66 319 60 C312 52 302 51 295 56Z" />

          {/* outer flourishes */}
          <path d="M145 45 C132 45 128 36 118 36 C108 36 104 43 97 45" />
          <path d="M145 45 C132 45 128 54 118 54 C108 54 104 47 97 45" />

          <path d="M355 45 C368 45 372 36 382 36 C392 36 396 43 403 45" />
          <path d="M355 45 C368 45 372 54 382 54 C392 54 396 47 403 45" />

          {/* tiny dots */}
          <circle cx="155" cy="30" r="2" />
          <circle cx="155" cy="60" r="2" />
          <circle cx="345" cy="30" r="2" />
          <circle cx="345" cy="60" r="2" />
        </g>
      </svg>
    );
  }


  if (variant === "corner") {
    const svg = (
      <svg
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        <g
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={opacity}
        >

          {/* paisley (boteh) accents, tucked beside the main stem */}
          <path d="M40 260 C 30 246 33 230 47 222 C 61 230 61 248 48 262 C 45 265 42 263 40 260 Z" />
          <path d="M175 45 C 165 31 168 15 182 7 C 196 15 196 33 183 47 C 180 50 177 48 175 45 Z" />

          {/* Main flowing stem */}
          <path
            d="
              M12 300
              C45 270 45 225 72 195
              C99 165 125 160 145 130
              C165 100 172 63 205 28
            "
          />

          {/* Large leaves */}
          <path d="M66 210 C38 198 25 174 34 151 C58 157 73 181 66 210Z" />
          <path d="M84 184 C58 174 50 150 62 131 C83 138 94 159 84 184Z" />
          <path d="M111 158 C88 145 86 121 101 105 C120 115 127 139 111 158Z" />

          <path d="M57 220 C82 209 105 218 111 239 C91 247 68 241 57 220Z" />
          <path d="M91 187 C116 177 137 187 141 208 C121 215 100 207 91 187Z" />

          {/* Small leaf branches */}
          <path d="M72 195 C53 190 45 181 42 168" />
          <path d="M85 182 C72 168 67 153 69 140" />
          <path d="M111 158 C102 142 103 126 110 113" />

          {/* Floral bloom */}
          <circle cx="205" cy="28" r="8" />
          <circle cx="205" cy="28" r="3" />

          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <ellipse
              key={angle}
              cx="205"
              cy="13"
              rx="7"
              ry="16"
              transform={`rotate(${angle} 205 28)`}
            />
          ))}

          {/* Tiny flowers */}
          <g transform="translate(150 117)">
            <circle cx="0" cy="0" r="3" />
            <ellipse cx="0" cy="-8" rx="3" ry="7" />
            <ellipse cx="8" cy="0" rx="7" ry="3" />
            <ellipse cx="0" cy="8" rx="3" ry="7" />
            <ellipse cx="-8" cy="0" rx="7" ry="3" />
          </g>

          <g transform="translate(123 145)">
            <circle cx="0" cy="0" r="2.5" />
            <ellipse cx="0" cy="-7" rx="2.5" ry="6" />
            <ellipse cx="7" cy="0" rx="6" ry="2.5" />
            <ellipse cx="0" cy="7" rx="2.5" ry="6" />
            <ellipse cx="-7" cy="0" rx="6" ry="2.5" />
          </g>

          {/* Decorative curls */}
          <path d="M31 151 C17 143 12 129 21 118 C30 107 43 116 39 127 C36 134 27 132 27 125" />
          <path d="M143 131 C133 119 136 105 148 100 C159 95 167 105 161 114" />

        </g>
      </svg>
    );

    return (
      <div className={rootClassName} aria-hidden="true">
        {wrapSpin(svg)}
      </div>
    );
  }


  /* =========================================================
     FULL FLORAL ORNAMENT
     ========================================================= */

  const floralSvg = (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      aria-hidden="true"
    >

      <g
        stroke={color}
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
      >

        {/* =================================================
            OUTER JAALI RING
            (fine dashed circle + radiating ticks, instead of
            plain concentric rings, so it reads as fretwork
            rather than a target)
        ================================================= */}

        <circle
          cx="300"
          cy="300"
          r="272"
          strokeWidth="0.75"
          strokeDasharray="1 7"
        />

        {[...Array(48)].map((_, i) => (
          <line
            key={`jaali-tick-${i}`}
            x1="300"
            y1="248"
            x2="300"
            y2="258"
            strokeWidth="0.6"
            transform={`rotate(${i * 7.5} 300 300)`}
          />
        ))}


        {/* =================================================
            OUTER PETAL RING
        ================================================= */}

        {[...Array(16)].map((_, i) => (
          <g
            key={`outer-${i}`}
            transform={`rotate(${i * 22.5} 300 300)`}
          >

            <path
              d="
                M300 55
                C330 76 342 107 300 142
                C258 107 270 76 300 55Z
              "
            />

            <path
              d="
                M300 68
                C318 86 321 105 300 124
                C279 105 282 86 300 68Z
              "
            />

          </g>
        ))}


        {/* =================================================
            PAISLEY (BOTEH) RING
        ================================================= */}

        {[...Array(8)].map((_, i) => (
          <path
            key={`paisley-${i}`}
            d="
              M300 62
              C 324 63 338 82 332 106
              C 327 127 306 136 289 125
              C 276 116 277 96 290 82
              C 295 76 298 69 300 62Z
            "
            transform={`rotate(${i * 45 + 22.5} 300 300)`}
          />
        ))}

        {/* =================================================
            VINE / LEAF RING
        ================================================= */}

        {[...Array(12)].map((_, i) => (
          <g
            key={`vine-${i}`}
            transform={`rotate(${i * 30} 300 300)`}
          >

            {/* curved branch */}
            <path
              d="
                M300 92
                C274 116 270 140 285 164
                C295 180 305 184 300 205
              "
            />

            {/* left leaf */}
            <path
              d="
                M279 132
                C254 119 242 101 249 87
                C269 92 283 108 279 132Z
              "
            />

            {/* right leaf */}
            <path
              d="
                M280 151
                C257 148 242 158 240 176
                C259 179 276 169 280 151Z
              "
            />

            {/* small leaf */}
            <path
              d="
                M289 173
                C273 171 264 180 266 192
                C280 193 290 186 289 173Z
              "
            />

          </g>
        ))}


        {/* =================================================
            INNER PETAL RING
        ================================================= */}

        {[...Array(12)].map((_, i) => (
          <g
            key={`inner-petal-${i}`}
            transform={`rotate(${i * 30 + 15} 300 300)`}
          >

            <path
              d="
                M300 150
                C326 169 334 198 300 225
                C266 198 274 169 300 150Z
              "
            />

            <path
              d="
                M300 164
                C314 178 317 194 300 210
                C283 194 286 178 300 164Z
              "
            />

          </g>
        ))}


        {/* =================================================
            INNER FLOWER
        ================================================= */}

        {[...Array(8)].map((_, i) => (
          <g
            key={`flower-${i}`}
            transform={`rotate(${i * 45} 300 300)`}
          >

            <path
              d="
                M300 210
                C331 224 342 252 300 300
                C258 252 269 224 300 210Z
              "
            />

            <path
              d="
                M300 225
                C319 238 321 258 300 282
                C279 258 281 238 300 225Z
              "
            />

          </g>
        ))}


        {/* =================================================
            CENTRAL FLOWER
        ================================================= */}

        {[...Array(8)].map((_, i) => (
          <ellipse
            key={`center-petal-${i}`}
            cx="300"
            cy="266"
            rx="13"
            ry="34"
            transform={`rotate(${i * 45} 300 300)`}
          />
        ))}


        <circle cx="300" cy="300" r="32" />
        <circle cx="300" cy="300" r="19" />
        <circle cx="300" cy="300" r="5" />


        {/* =================================================
            SMALL DECORATIVE DOTS
        ================================================= */}

        {[...Array(24)].map((_, i) => {

          const angle = (i * 15 * Math.PI) / 180;

          const x = 300 + Math.cos(angle) * 225;
          const y = 300 + Math.sin(angle) * 225;

          return (
            <circle
              key={`dot-${i}`}
              cx={x}
              cy={y}
              r="2"
            />
          );

        })}


        {/* =================================================
            TINY FLOWERS
        ================================================= */}

        {[...Array(12)].map((_, i) => {

          const angle = (i * 30 * Math.PI) / 180;

          const x = 300 + Math.cos(angle) * 188;
          const y = 300 + Math.sin(angle) * 188;

          return (
            <g
              key={`tiny-${i}`}
              transform={`translate(${x} ${y})`}
            >

              <circle cx="0" cy="0" r="2.5" />

              <ellipse
                cx="0"
                cy="-8"
                rx="3"
                ry="7"
              />

              <ellipse
                cx="8"
                cy="0"
                rx="7"
                ry="3"
              />

              <ellipse
                cx="0"
                cy="8"
                rx="3"
                ry="7"
              />

              <ellipse
                cx="-8"
                cy="0"
                rx="7"
                ry="3"
              />

            </g>
          );

        })}

      </g>

    </svg>
  );

  return (
    <div className={rootClassName} aria-hidden="true">
      {wrapSpin(floralSvg)}
    </div>
  );
}