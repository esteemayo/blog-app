const { StatusCodes } = require('http-status-codes');

const APIFeatures = require('../utils/apiFeatures');
const NotFoundError = require('../errors/notFound');

exports.getAll = (Model) => async (req, res, next) => {
  const features = new APIFeatures(Model.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const docs = await features.query;

  res.status(StatusCodes.OK).json({
    status: 'success',
    nbHits: docs.length,
    requestedAt: req.requestTime,
    docs,
  });
};

exports.getOneById = (Model) => async (req, res, next) => {
  const { id: docId } = req.params;

  const doc = await Model.findById(docId);

  if (!doc) {
    return next(
      new NotFoundError(`There is no document with the given ID → ${docId}`)
    );
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    doc,
  });
};

exports.getOneBySlug = (Model) => async (req, res, next) => {
  const { slug } = req.params;

  const doc = await Model.findOne({ slug });

  if (!doc) {
    return next(
      new NotFoundError(`There is no document with the given SLUG → ${slug}`)
    );
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    doc,
  });
};

exports.createOne = (Model) => async (req, res, next) => {
  const doc = await Model.create({ ...req.body });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    doc,
  });
};

exports.updateOne = (Model) => async (req, res, next) => {
  const { id: docId } = req.params;

  const updatedDoc = await Model.findByIdAndUpdate(
    docId,
    { $set: { ...req.body } },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedDoc) {
    return next(
      new NotFoundError(`There is no document with the given ID → ${docId}`)
    );
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    doc: updatedDoc,
  });
};

exports.deleteOne = (Model) => async (req, res, next) => {
  const { id: docId } = req.params;

  const doc = await Model.findByIdAndDelete(docId);

  if (!doc) {
    return next(
      new NotFoundError(`There is no document with the given ID → ${docId}`)
    );
  }

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    doc: null,
  });
};
