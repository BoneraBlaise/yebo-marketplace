/** Routes knowledge queries through the pipeline */
export class KnowledgeRouter {
  constructor({ pipeline, search }) {
    this.pipeline = pipeline;
    this.search = search;
  }

  route(query, options = {}) {
    if (options.method && typeof this.search[options.method] === "function") {
      return this.search[options.method](query, options);
    }
    return this.pipeline.execute(query, options);
  }
}

export const createKnowledgeRouter = (deps) => new KnowledgeRouter(deps);

export default KnowledgeRouter;
