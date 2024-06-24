import 'dotenv/config';
import * as joi from 'joi';

type EnvVars = {
  PORT: number;
};

const envVarsSchema = joi
  .object({
    PORT: joi.number().required(),
  })
  .unknown(true);

const { error, value } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const config = {
  port: envVars.PORT,
};
