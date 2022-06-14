import fs from 'fs';
import path from 'path';
import { globbyStream } from 'globby';
import { getCatalog } from './util/getCatalog';
import { getAllTypesData } from './util/getAllTypesData';
import type {
  Catalog,
  Category,
  ComponentName,
  Properties,
} from './types/catalog';
import { TypeFileName } from './types/allTypesData';

const catalog = getCatalog();
const allTypesData = getAllTypesData();

createAllPropsTables();

async function createAllPropsTables() {
  for await (const componentFilepath of globbyStream(
    path.join(
      __dirname,
      '../../docs/src/pages/[platform]/components/*/index.page.mdx'
    )
  )) {
    const regex =
      /src\/pages\/\[platform\]\/components\/(\w*)\/index\.page\.mdx/;
    const componentPageName = (componentFilepath as string).match(
      regex
    )[1] as Lowercase<ComponentName>;
    const properties = getObjectValueWithCaselessKey(
      catalog,
      componentPageName
    );
    const propsSortedByCategory = getPropsSortedByCategory(
      properties,
      componentPageName
    );

    if (!propsSortedByCategory) {
      console.log(`❗️ Not generating props table for ${componentPageName}`);
      continue;
    }

    const componentName = Object.keys(
      propsSortedByCategory[0]
    )[0] as ComponentName;

    const expander = PropsTableExpander(propsSortedByCategory);

    fs.writeFileSync(
      path.join(
        __dirname,
        '../../docs/src/pages/[platform]/components/',
        `./${componentPageName}/props-table.mdx`
      ),
      Output(componentName, expander)
    );
    console.log(`✅ ${componentPageName} Props Tables are updated.`);
  }
}

type CategoryProperty = { [key in Category]: Properties };
type SortedPropertiesByCategory = CategoryProperty[];
type PropertiesByCategory = Record<Category, Properties>;

/**
 * @todo After Marketing Launch 2022-06, to update the note under the Props Heading to specify the HTML element's name and MDN link.
 */
function Output(displayName, tableExpander) {
  return `
{/* DO NOT EDIT DIRECTLY */}
{/* This file is autogenerated by "docs/scripts/generate-props-tables.ts" script. */}
{/* See Docs README to generate */}
import { Expander, ExpanderItem, Table, TableBody, TableCell, TableHead, TableRow } from '@aws-amplify/ui-react';

## ${displayName} Props

The ${displayName} will accept any of the standard HTML attributes that a HTML element accepts. Standard element attributes can be found in the [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element).

\`*\` indicates required props.

${tableExpander}
`;
}

function PropsTableExpander(propsSortedByCategory: SortedPropertiesByCategory) {
  const defaultOpen = Object.keys(propsSortedByCategory[0])[0];
  const expanderItem = (categoryProperty: CategoryProperty): string => {
    const title = Object.keys(categoryProperty)[0];
    const table = PropsTable(categoryProperty[title]);
    return `
<ExpanderItem title="${title}" value="${title}">
    ${table}
</ExpanderItem>
`;
  };

  return `
<Expander type="multiple" defaultValue={['${defaultOpen}']} className="props-table-expander" >
  ${propsSortedByCategory.map(expanderItem).join('')}
</Expander>
`;
}

function PropsTable(properties: Properties) {
  const rows = Object.entries(properties)
    .sort(([propNameA], [propNameB]) => propNameA.localeCompare(propNameB))
    .map(
      ([propName, { name, type, description, isOptional }]) => `
    <TableRow>
      <TableCell className="props-table__tr-name">${name}${
        isOptional ? '' : '<sup>*</sup>'
      }</TableCell>
      <TableCell>${`
\`\`\`jsx
${type}
\`\`\`
`}</TableCell>
      <TableCell className="props-table__tr-description">${description}</TableCell>
    </TableRow>
`
    );
  return `
<Table
  highlightOnHover={true}
  className="props-table"
  >
  <TableHead>
    <TableRow>
      <TableCell as="th">Name</TableCell>
      <TableCell as="th">Type</TableCell>
      <TableCell as="th">Description</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    ${rows.join('')}
  </TableBody>
</Table>
`;
}

function getPropsSortedByCategory(
  properties: Properties,
  componentPageName: Lowercase<ComponentName>
): SortedPropertiesByCategory {
  if (properties) {
    let propertiesByCategory: PropertiesByCategory =
      getPropertiesByCategory(componentPageName);

    const componentName =
      Object.keys(propertiesByCategory).find(
        (category) => category.toLowerCase() === componentPageName
      ) ?? (componentPageName as ComponentName | Lowercase<ComponentName>);

    const allCategories = [
      componentName,
      ...Object.keys(propertiesByCategory)
        .filter(
          (category) => ![componentName, 'Style', 'Other'].includes(category) // remove "Style" Category because we've already got the style props page
        )
        .sort((a, b) => a.localeCompare(b)),
      // 'Other',  // 1. No need to show this category to the customers 2. It causes Amplify Hosting build memory leak
    ] as (Category | 'Other')[];

    return allCategories
      .map(
        (category) =>
          ({
            [category]:
              category === componentName
                ? combineCategories(propertiesByCategory, [category, 'Base'])
                : getObjectValueWithCaselessKey(propertiesByCategory, category),
          } as {
            [key in Category]: Properties;
          })
      )
      .filter((val) => Object.values(val)[0] && Object.keys(val)[0] !== 'Base');
  } else {
    console.log(` 🫥  ${componentPageName} doesn't have any type properties.`);
    return null;
  }
}

function combineCategories(
  propertiesByCategory,
  toBeCombined: (Category | 'Other')[]
) {
  return toBeCombined.reduce(
    (acc, category) => ({
      ...acc,
      ...getObjectValueWithCaselessKey(propertiesByCategory, category),
    }),
    {}
  );
}

function getPropertiesByCategory(
  componentPageName: Lowercase<ComponentName>
): PropertiesByCategory {
  let propertiesByCategory: PropertiesByCategory = {} as PropertiesByCategory;

  /**
   * Some special components doesn't have accurate properties generated from getCatalog, so we have to manually point it to AllTypesData as well.
   */
  const specialComponents = {
    view: ['View', 'Input'],
    textfield: ['TextField', 'Input', 'Field'],
  };

  for (const propertyName in getObjectValueWithCaselessKey(
    catalog,
    componentPageName
  )) {
    const property = getObjectValueWithCaselessKey(catalog, componentPageName)[
      propertyName
    ];
    propertiesByCategory = {
      ...propertiesByCategory,
      [property.category]: {
        ...propertiesByCategory[property.category],
        [propertyName]: property,
      },
    };
  }
  if (Object.keys(specialComponents).includes(componentPageName)) {
    const componentName = specialComponents[componentPageName][0];
    propertiesByCategory = {
      ...propertiesByCategory,
      [componentName]: {
        ...propertiesByCategory[componentName],
        ...getPropertiesFromAllTypeData(specialComponents[componentPageName]),
      },
    };
  }
  return propertiesByCategory;
}

function getPropertiesFromAllTypeData(sourceTypes: TypeFileName[]) {
  let targetProps: Properties;

  sourceTypes.forEach((type) => {
    for (const [propName, property] of allTypesData.get(type).entries()) {
      targetProps = {
        ...targetProps,
        [propName]: {
          name: String(property.get('name')),
          type: String(property.get('type')),
          description: property.get('description')
            ? (property.get('description') as { description: string })
                .description
            : '',
          category: property.get('category') as Category,
          isOptional: property.get('isOptional') as boolean,
        },
      };
    }
  });
  return targetProps;
}

/**
 *
 * @name getProperties
 * @description case-insensitively get the values from an object
 */
function getObjectValueWithCaselessKey(
  object: PropertiesByCategory | Catalog,
  key:
    | ComponentName
    | Lowercase<ComponentName>
    | Category
    | Lowercase<Category>
    | 'Other'
): Properties;
function getObjectValueWithCaselessKey(object, key) {
  const asLowercase = key.toLowerCase();
  return object[
    Object.keys(object).find((k) => k.toLowerCase() === asLowercase)
  ];
}
