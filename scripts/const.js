const RUN_ENV = process.env.RUN_ENV;

exports.RUN_ENV = RUN_ENV;

exports.PUBLIC_PATH = RUN_ENV === "dev" ? "/docflow/drawio/" : "/";

exports.HOT_ENV = process.env.HOT_ENV;

exports.DEV_HOT = process.env["DEV_HOT"];
