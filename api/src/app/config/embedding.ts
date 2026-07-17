import { InferenceClient  } from "@huggingface/inference";
import config from ".";

const hf = new InferenceClient(config.HF_TOKEN);

const embedding = async(input : string) =>{
return  await hf.featureExtraction({
  model: "BAAI/bge-m3",
  inputs: input,
});
}

export default embedding;

