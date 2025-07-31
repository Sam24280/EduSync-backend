import QueryBuilder from "../../builder/QueryBuilder";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { Materials } from "./materials.model";


const getAllMaterials = async (offeredCourseId: string, query: any) => {
    const materialQuery = new QueryBuilder(Materials.find({ offeredCourseId, isDeleted: false }).populate('offeredCourseId facultyId'), query);
    const meta = await materialQuery.countTotal();
    const result = await materialQuery.modelQuery;
    return {
        meta,
        result,
    };
}

const getSingleMaterial = async (id: string) => {
    const result = await Materials.findOne({ _id: id, isDeleted: false }).populate('offeredCourseId facultyId');
    if (!result) {
        throw new Error('Material not found');
    }
    return result;
}

const createMaterial = async (file: any, payload: any) => {

    payload.fileUrl = '';
    if (file) {
        const title_slug = payload?.title?.replace(/\s+/g, '-').toLowerCase();
        const uuid = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = `${uuid}-${title_slug}`;
        const path = file?.path;

        //send image to cloudinary
        const { secure_url } = await sendImageToCloudinary(fileName, path);
        payload.fileUrl = secure_url as string;
    }

    const material = await Materials.create(payload);
    return material;
}

const updateMaterial = async (id: string, file: any, payload: any) => {
    payload.fileUrl = '';

    const idExistMaterial = await Materials.findOne({ _id: id, isDeleted: false })
    console.log("idExistMaterial", idExistMaterial);
    if (!idExistMaterial) {
        throw new Error('Material not found');
    }
    if (file) {
        const title = payload?.title || idExistMaterial.title;
        const title_slug = title?.replace(/\s+/g, '-').toLowerCase();
        const uuid = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = `${uuid}-${title_slug}`;
        const path = file?.path;

        //send image to cloudinary
        const { secure_url } = await sendImageToCloudinary(fileName, path);
        payload.fileUrl = secure_url as string;
    }
    const material = await Materials.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).populate('offeredCourseId facultyId');
    if (!material) {
        throw new Error('Material not found');
    }
    return material;
}

const deleteMaterial = async (id: string) => {
    const material = await Materials.findByIdAndUpdate(id, { isDeleted: true }, {
        new: true,
        runValidators: true,
    });
    return material;
}

export const MaterialsService = {
    getAllMaterials,
    getSingleMaterial,
    createMaterial,
    updateMaterial,
    deleteMaterial,
};