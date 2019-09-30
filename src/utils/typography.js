import Typography from "typography"
import Github from "typography-theme-github"

Github.overrideThemeStyles = ({ rhythm }, options) => ({
  "ol,ul": {
    marginLeft: 0,
  },
  "li>ol,li>ul": {
    marginLeft: 0,
  },
})

const typography = new Typography(Github)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
