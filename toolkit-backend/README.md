## Setup environment

1. install `conda`, follow tutorial [here](https://vocus.cc/article/63c16c72fd89780001276284)

2. check if `conda` is installed successfully 
```
conda -V  -- return version number
```

3. create virtual environment called `esg`
```
conda create -n esg python=3.10
```

4. activate virtual environment
```
conda activate esg
```

5. install python packages
```
pip install -r requirements.txt
```

## Local Server

Start the development server on `http://localhost:8000/docs`

```
uvicorn main:app --reload
```

## Environment variable



## Reference 
- https://github.com/dorinclisu/fastapi-auth0