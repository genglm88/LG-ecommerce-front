import mongoose, { model, Schema, models } from "mongoose"

const AddressSchema = new Schema(
  {
    userEmail: {type: String, unique:true, required: true,},
    name: { type: String,  },
    email: { type: String,  },
    city: { type: String,  },
    postalCode: [{ type: Number }],
    streetAddr1: { type: String,  },
    streetAddr2: {type: String,},
    country: { type: String,  },
  },
  {
    timestamps: true,
  }
)

const Address = models.Address || model("Address", AddressSchema)

export default Address
