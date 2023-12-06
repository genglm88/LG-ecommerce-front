import mongooseConnect from "@/lib/mongoose"
import Product from "@/models/Product"

export default async function handler(req, res) {
  await mongooseConnect()
  const { categories, sort, phrase, ...filters } = req.query
  //console.log(categories)
  //   const productQuery = {
  //     categoryId: categories?.split(","),
  //   }

  //console.log({sort}) { sort: 'price_asc' }
  const [sortField, sortOrder] = (sort || "_id-desc").split("-")

  const productQuery = {}
  if (categories) {
    productQuery.categoryId = categories.split(",")
  }

  if (phrase) {
    productQuery["$or"] = [
      { title: { $regex: phrase, $options:'i'} },
      { description: { $regex: phrase, $options: 'i'} },
    ]
  }

  //console.log(Object.keys(filters))
  const filterNames = Object.keys(filters)
  if (filterNames.length > 0) {
    filterNames.forEach((propName) => {
      productQuery["productProperties." + propName] = filters[propName]
    })
    // productQuery.productProperties = filters
  }

  res.json(
    await Product.find(productQuery, null, {
      sort: { [sortField]: sortOrder === "asc" ? 1 : -1 },
    })
  )
}
