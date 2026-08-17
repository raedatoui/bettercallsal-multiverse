# Better Call Sal

## The BetterCallSal Multiverse

| <a href="https://bettercallsal.biz" target="_blank"><img src="https://storage.googleapis.com/bcs-assets/images/biz/sal-left.webp" alt="biz" style="width:129px" /></a> | <a href="https://bettercallsal.rocks" target="_blank"><img src="https://storage.googleapis.com/bcs-assets/images/rocks/spinning.rocks.left.webp" alt="rocks" style="width:129px" /></a> | <a href="https://bettercallsal.fit" target="_blank"><img src="https://storage.googleapis.com/bcs-assets/images/fit/shweaty-left.webp" alt="fit" style="width:129px" /></a> | <a href="https://bettercallsal.art" target="_blank"><img src="https://storage.googleapis.com/bcs-assets/images/art/spinning.art.left.webp" alt="art" style="width:129px" /></a> | <a href="https://bettercallsal.games" target="_blank"><img src="https://storage.googleapis.com/bcs-assets/images/games/spinning.games.left.webp" alt="games" style="width:129px" /></a> | <a href="https://bettercallsal.construction" target="_blank"><img src="https://storage.googleapis.com/bcs-assets/images/construction/spinning.construction.left-aspect.png" alt="construction" style="width:129px" /></a> | <a href="https://bettercallsal.gallery" target="_blank"><img src="https://storage.googleapis.com/bcs-assets/images/gallery/gallery-left-sm.png" alt="gallery" style="width:129px" /></a> | <a href="https://bettercallsal.world" target="_blank"><img src="https://storage.googleapis.com/bcs-assets/images/world/world-left.webp" alt="world" style="width:129px" /></a> | <a href="https://bettercallsal.wtf" target="_blank"><img src="https://storage.googleapis.com/bcs-assets/images/games/spinning.games.right.webp" alt="wtf" style="width:129px" /></a> |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |

Nine sites, one codebase — the build target is picked at build time via `selectedSite` in
`next.config.env.json`. Press the hotkey anywhere on a site to swap the rendered universe.

| Site                                                              | Key            | Hotkey | Notes                                                            |
| ----------------------------------------------------------------- | -------------- | ------ | ---------------------------------------------------------------- |
| [bettercallsal.biz](https://bettercallsal.biz)                   | `biz`          | `b`    | the original                                                     |
| [bettercallsal.art](https://bettercallsal.art)                   | `art`          | `a`    |                                                                  |
| [bettercallsal.games](https://bettercallsal.games)               | `games`        | `g`    | unity / wasm / webgl                                             |
| [bettercallsal.rocks](https://bettercallsal.rocks)               | `rocks`        | `r`    |                                                                  |
| [bettercallsal.construction](https://bettercallsal.construction) | `construction` | `c`    | no content list — renders `<Construction />`                     |
| [bettercallsal.fit](https://bettercallsal.fit)                   | `fit`          | `f`    |                                                                  |
| [bettercallsal.gallery](https://bettercallsal.gallery)           | `gallery`      | `y`    |                                                                  |
| [bettercallsal.world](https://bettercallsal.world)               | `world`        | `w`    |                                                                  |
| [bettercallsal.wtf](https://bettercallsal.wtf)                   | `wtf`          | `t`    | procedurally generated — shuffles the other sites' pieces        |

<div align="center">
   <img src="https://storage.googleapis.com/bcs-assets/images/phone-homescreen.png" alt="phone-homescreen" style="width:500px" />
</div>
<br />

Inspired by this [website](http://bettercallsaul.amc.com), the BetterCallSal Multiverse runs on the SalStack

|                                                        Next.js SSR                                                        |                                                          Styled Components                                                          |                                                     Firebase (hosting)                                                      |                                                      Google Cloud Storage                                                      |
| :-----------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------: |
| ![next-js-logo](https://github.com/raedatoui/bettercallsal-multiverse/assets/327971/224662b4-94ef-4a03-984f-ca294a666d30) | ![styledcomponents-color](https://github.com/raedatoui/bettercallsal-multiverse/assets/327971/65e27653-7602-4095-888b-8fa7e1e3bb92) | ![firebase-color](https://github.com/raedatoui/bettercallsal-multiverse/assets/327971/3b9a3a6e-6f44-435b-a146-c2543575729a) | ![googlecloud-color](https://github.com/raedatoui/bettercallsal-multiverse/assets/327971/292e068f-16cd-4aad-bf94-eddd364e5bba) |

## Frontend

- next.js
- styled components
- react
- three.js / glsl
- zod
- keen-slider
- unity / wasm / webgl

## Backend

- Firebase for hosting
- Google Cloud Storage for assets
