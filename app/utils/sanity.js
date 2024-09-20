import { client } from './configSanity';
export async function getConstellations() {
  const query = `
  *[_type == "constellation" && title == "School Attributes"]{
    _id,
    title,
    description,
    "children": childConstellations[]->{
      _id,
      title,
      description,
      "children": childConstellations[]->{
        _id,
        title,
        description,
        "children": childConstellations[]->{
          _id,
          title,
          description,
          "children": childConstellations[]->{
            _id,
            title,
            description,
            "children": childConstellations[]->{
              _id,
              title,
              description
            }
          }
        }
      }
    }
  }
  `;
  const data = await client.fetch(query);
  return data;
}

export async function getAxes() {
  const query = `
  *[_type == "axes" && title == "Knowledge Axes"]{
    _id,
    title,
    category,
    description,
    "children": children[]->{
      _id,
      title,
      category,
      description,
      "children": children[]->{
        _id,
        title,
        category,
        description,
        "children": children[]->{
          _id,
          title,
          category,
          description,
          "children": children[]->{
            _id,
            title,
            category,
            description,
            "children": children[]->{
              _id,
              title,
              category,
              description,
              "children": children[]->{
                _id,
                title,
                category,
                description,
                "children": children[]->{
                  _id,
                  title,
                  category,
                  description,
                  "children": children[]->{
                    _id,
                    title,
                    category,
                    description,
                    "children": children[]->{
                      _id,
                      title,
                      category,
                      description
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  `;
  const data = await client.fetch(query);
  return data;
}

export async function getExternalConnections() {
  const query = `
  *[_type == "external"]{
    _id,
    title,
    "connection1": connection1->{
      _id,
      title
    },
    "connection2": connection2->{
      _id,
      title
    }
  }
  `;

  const data = await client.fetch(query);
  return data;
}

export async function getAbout() {
  const query = `
  *[_type == "about"] {
    _id,
    title,
    firstParagraph,
    secondParagraph,
    thirdParagraph,
    fourthParagraph
  }
  `;
  const data = await client.fetch(query);
  return data;
}
