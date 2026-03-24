export type CoverTheme = "light" | "dark" | "vibrant" | "minimal";

export interface ProfileCoverTemplate {
  id: string;
  title: string;
  category: string;
  preview: string;
  fullAsset: string;
  theme: CoverTheme;
  tags: string[];
  premium: boolean;
  recommendedFor: string[];
}

const makeCover = (
  id: string,
  title: string,
  category: string,
  theme: CoverTheme,
  background: string,
  tags: string[],
  recommendedFor: string[],
  premium = false,
): ProfileCoverTemplate => ({
  id,
  title,
  category,
  preview: background,
  fullAsset: background,
  theme,
  tags,
  premium,
  recommendedFor,
});

export const PROFILE_COVER_CATEGORIES = [
  "Minimal gradients",
  "Soft mesh gradients",
  "Glassmorphism abstracts",
  "Fluid waves",
  "Aurora lights",
  "Blurred color fields",
  "Geometric premium",
  "Monochrome luxury",
  "Dark modern",
  "Vibrant creator style",
  "Metallic soft light",
  "Editorial abstract textures",
] as const;

export const PROFILE_COVER_TEMPLATES: ProfileCoverTemplate[] = [
  makeCover("minimal-dawn", "Dawn Layer", "Minimal gradients", "minimal", "radial-gradient(circle at 18% 24%, rgba(255,255,255,0.88), transparent 28%), linear-gradient(135deg, #faf7f2 0%, #f3efe9 48%, #e6edf6 100%)", ["clean", "airy", "calm"], ["minimal", "editorial", "founder"]),
  makeCover("minimal-sand", "Sand Current", "Minimal gradients", "minimal", "linear-gradient(145deg, #fbf4ea 0%, #efe7dc 46%, #dde6f3 100%)", ["warm", "soft", "calm"], ["travel", "minimal", "creator"]),
  makeCover("mesh-petal", "Petal Mesh", "Soft mesh gradients", "light", "radial-gradient(circle at 18% 22%, rgba(255, 196, 213, 0.85), transparent 26%), radial-gradient(circle at 78% 18%, rgba(194, 220, 255, 0.8), transparent 28%), radial-gradient(circle at 62% 78%, rgba(255, 230, 196, 0.9), transparent 32%), linear-gradient(160deg, #fbf7ff 0%, #f6f7fb 100%)", ["mesh", "soft", "pastel"], ["creator", "lifestyle", "editorial"]),
  makeCover("mesh-lagoon", "Lagoon Mesh", "Soft mesh gradients", "light", "radial-gradient(circle at 20% 30%, rgba(156, 228, 213, 0.8), transparent 24%), radial-gradient(circle at 82% 18%, rgba(177, 198, 255, 0.82), transparent 24%), radial-gradient(circle at 54% 84%, rgba(255, 214, 188, 0.78), transparent 30%), linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%)", ["fresh", "sea", "refined"], ["travel", "creator", "wellness"]),
  makeCover("glass-opal", "Opal Glass", "Glassmorphism abstracts", "light", "linear-gradient(135deg, #e8eef9 0%, #f8f4ff 52%, #eef7f5 100%)", ["glass", "opal", "premium"], ["editorial", "beauty", "creator"], true),
  makeCover("glass-sage", "Sage Lens", "Glassmorphism abstracts", "light", "linear-gradient(135deg, #eef7f2 0%, #f8fafb 42%, #edf0f7 100%)", ["glass", "sage", "minimal"], ["wellness", "founder", "minimal"]),
  makeCover("waves-silk", "Silk Motion", "Fluid waves", "light", "linear-gradient(135deg, #f9f4ef 0%, #f8fbff 52%, #eef3ff 100%), radial-gradient(circle at 22% 72%, rgba(255, 196, 164, 0.45), transparent 24%), radial-gradient(circle at 78% 24%, rgba(154, 184, 255, 0.42), transparent 28%)", ["fluid", "wave", "soft"], ["creator", "travel", "editorial"]),
  makeCover("waves-cobalt", "Cobalt Drift", "Fluid waves", "vibrant", "linear-gradient(140deg, #e9f1ff 0%, #dfe9ff 35%, #eef5ff 100%), radial-gradient(circle at 76% 18%, rgba(63, 124, 255, 0.4), transparent 26%), radial-gradient(circle at 20% 78%, rgba(61, 213, 255, 0.36), transparent 28%)", ["flow", "ocean", "clean"], ["creator", "tech", "video"]),
  makeCover("aurora-mint", "Mint Aurora", "Aurora lights", "vibrant", "radial-gradient(circle at 12% 20%, rgba(172, 255, 214, 0.58), transparent 24%), radial-gradient(circle at 78% 10%, rgba(168, 197, 255, 0.54), transparent 28%), radial-gradient(circle at 54% 78%, rgba(255, 218, 184, 0.42), transparent 26%), linear-gradient(160deg, #f1fbf7 0%, #eef4ff 100%)", ["aurora", "light", "fresh"], ["wellness", "creator", "travel"]),
  makeCover("aurora-lilac", "Lilac Aurora", "Aurora lights", "vibrant", "radial-gradient(circle at 18% 14%, rgba(198, 177, 255, 0.6), transparent 22%), radial-gradient(circle at 82% 22%, rgba(255, 195, 225, 0.56), transparent 24%), radial-gradient(circle at 62% 86%, rgba(172, 231, 255, 0.42), transparent 26%), linear-gradient(170deg, #f8f7ff 0%, #eef5ff 100%)", ["aurora", "soft", "fashion"], ["beauty", "editorial", "creator"]),
  makeCover("blur-apricot", "Apricot Blur", "Blurred color fields", "light", "radial-gradient(circle at 18% 26%, rgba(255, 196, 140, 0.86), transparent 20%), radial-gradient(circle at 76% 22%, rgba(255, 235, 200, 0.94), transparent 22%), radial-gradient(circle at 58% 84%, rgba(196, 216, 255, 0.72), transparent 28%), linear-gradient(180deg, #fff9f2 0%, #f5f8ff 100%)", ["blur", "warm", "editorial"], ["food", "travel", "creator"]),
  makeCover("blur-linen", "Linen Blur", "Blurred color fields", "minimal", "radial-gradient(circle at 22% 28%, rgba(232, 221, 205, 0.86), transparent 20%), radial-gradient(circle at 78% 22%, rgba(204, 217, 238, 0.78), transparent 20%), linear-gradient(180deg, #f8f5f1 0%, #eef3f8 100%)", ["linen", "soft", "neutral"], ["founder", "minimal", "editorial"]),
  makeCover("geo-marble", "Marble Frame", "Geometric premium", "light", "linear-gradient(135deg, #f8f7f4 0%, #eef2f6 100%)", ["geometry", "premium", "sharp"], ["founder", "luxury", "editorial"], true),
  makeCover("geo-prism", "Prism Panels", "Geometric premium", "light", "linear-gradient(135deg, #eef5ff 0%, #f7f4ff 56%, #f4f8fb 100%)", ["geometry", "structured", "bright"], ["tech", "creator", "editorial"]),
  makeCover("mono-ivory", "Ivory Luxe", "Monochrome luxury", "minimal", "linear-gradient(140deg, #f8f5ef 0%, #eee8df 48%, #f7f4ef 100%)", ["mono", "luxury", "ivory"], ["luxury", "beauty", "minimal"], true),
  makeCover("mono-graphite", "Graphite Luxe", "Monochrome luxury", "dark", "linear-gradient(145deg, #2a2e34 0%, #1f2328 52%, #14181d 100%)", ["mono", "graphite", "dark"], ["luxury", "founder", "tech"], true),
  makeCover("dark-ember", "Ember Fade", "Dark modern", "dark", "radial-gradient(circle at 18% 18%, rgba(255, 164, 104, 0.18), transparent 24%), radial-gradient(circle at 78% 18%, rgba(120, 132, 255, 0.22), transparent 22%), linear-gradient(140deg, #17191d 0%, #111317 48%, #0b0d10 100%)", ["dark", "modern", "soft"], ["tech", "creator", "founder"]),
  makeCover("dark-ink", "Ink Horizon", "Dark modern", "dark", "radial-gradient(circle at 72% 18%, rgba(86, 113, 255, 0.26), transparent 22%), radial-gradient(circle at 20% 78%, rgba(68, 195, 219, 0.18), transparent 22%), linear-gradient(145deg, #161a20 0%, #0f1218 100%)", ["ink", "night", "clean"], ["video", "tech", "music"]),
  makeCover("creator-punch", "Creator Punch", "Vibrant creator style", "vibrant", "radial-gradient(circle at 16% 18%, rgba(255, 195, 104, 0.7), transparent 20%), radial-gradient(circle at 78% 18%, rgba(255, 116, 168, 0.56), transparent 20%), radial-gradient(circle at 52% 86%, rgba(109, 184, 255, 0.5), transparent 24%), linear-gradient(145deg, #fff7f3 0%, #f6f7ff 100%)", ["vibrant", "creator", "bright"], ["creator", "travel", "fashion"]),
  makeCover("creator-pool", "Pool Pop", "Vibrant creator style", "vibrant", "radial-gradient(circle at 22% 24%, rgba(74, 224, 224, 0.68), transparent 20%), radial-gradient(circle at 78% 20%, rgba(255, 170, 199, 0.56), transparent 18%), linear-gradient(145deg, #f2fffb 0%, #eef4ff 100%)", ["bright", "fresh", "social"], ["lifestyle", "creator", "wellness"]),
  makeCover("metal-soft", "Soft Titanium", "Metallic soft light", "light", "linear-gradient(135deg, #f6f8fb 0%, #dfe5ee 28%, #f8fafc 58%, #e3e8f1 100%)", ["metallic", "silver", "clean"], ["tech", "founder", "minimal"], true),
  makeCover("metal-champagne", "Champagne Alloy", "Metallic soft light", "light", "linear-gradient(140deg, #fbf5ea 0%, #e7ddcf 24%, #f7f2ea 56%, #ece5da 100%)", ["metallic", "warm", "luxury"], ["beauty", "luxury", "creator"], true),
  makeCover("editorial-paper", "Paper Bloom", "Editorial abstract textures", "light", "linear-gradient(160deg, #f7f4ef 0%, #fdfbfa 40%, #edf2f7 100%)", ["editorial", "paper", "texture"], ["editorial", "writer", "minimal"]),
  makeCover("editorial-inkwash", "Ink Wash", "Editorial abstract textures", "dark", "linear-gradient(160deg, #2c3137 0%, #20242a 50%, #16191d 100%)", ["editorial", "ink", "texture"], ["writer", "founder", "dark"]),
];

export function getProfileCoverById(id: string) {
  return PROFILE_COVER_TEMPLATES.find((cover) => cover.id === id);
}

export function getRecommendedProfileCovers(userStyles: string[]) {
  const lowered = userStyles.map((style) => style.toLowerCase());

  return PROFILE_COVER_TEMPLATES.filter((cover) =>
    cover.recommendedFor.some((tag) => lowered.includes(tag.toLowerCase())),
  );
}
