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
      "children": children[]->{
        _id,
        title,
        category,
        "children": children[]->{
          _id,
          title,
          category,
          "children": children[]->{
            _id,
            title,
            category,
            "children": children[]->{
              _id,
              title,
              category,
              "children": children[]->{
                _id,
                title,
                category,
                "children": children[]->{
                  _id,
                  title,
                  category,
                  "children": children[]->{
                    _id,
                    title,
                    category,
                    "children": children[]->{
                      _id,
                      title,
                      category
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
