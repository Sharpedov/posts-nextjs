import { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";

const GlobalStyle = createGlobalStyle`
   ${normalize};

    *,*::before,*::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    html {
        font-size: 62.5%;
    }

    body {
        font-family: ${({ theme }) => theme.fonts.main};
        font-size: 1.6rem;
        background: ${({ theme }) => theme.colors.background.primary};
        color: ${({ theme }) => theme.colors.color.primary};
        ::selection {
        background-color: green;
        }
        transition: background 0.2s ease;
        color: background 0.2s ease;
    }

    h1,h2,h3,h3,h4,h5,h6,button {
        font-family: ${({ theme }) => theme.fonts.title};
        margin: 0;
    }

    input, textarea {
        outline: none;
        border: none;
    }

    a {
        text-decoration: none;
        outline: none;
        color: inherit;
    }

    li {
        list-style: none;
    }

    .my-masonry-grid {
      display: flex;
     width: 100%;
}
.my-masonry-grid_column {
  padding-left: 15px; /* gutter size */
  background-clip: padding-box;

  :first-of-type{
      padding-left: 0;
  }
}

/* Style your items */
.my-masonry-grid_column > li { /* change div to reference your elements you put in <Masonry> */
  margin-bottom: 15px;

}
`;

export default GlobalStyle;
