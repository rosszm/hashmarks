# Hashmarks

Web application that allows users to search active NHL players
and view visualizations for individual player statistics. See
[system architecture](https://github.com/rosszm/hashmarks/wiki#system-architecture)
for more detailed design and implementation details.

[View Demo](https://rosszm.github.io/hashmarks)

## Dependencies
- Python >= 3.10
- Node >= v16.11.1

## Local Installation (dev)

### Clone the repository and open directory
```sh
git clone https://github.com/rosszm/hashmarks.git
cd hashmarks
```

### Install Python dependencies and start API

It is highly recommended you use a virtual environment for installing and
running  the API. See [Creating Virtual Environments](https://docs.python.org/3/library/venv.html#creating-virtual-environments).

```sh
pip install -r api/requirements.txt
uvicorn api/nhlapi.api:app --reload --port 8000
```
This will start the API at http://localhost:8000.


### Install Node dependencies and start app (yarn)
```sh
cd app
yarn install
yarn start
```
By default, the web app will run at http://localhost:3000.


## Acknowledgements

[Drew Hynes](https://gitlab.com/dword4) - for his [NHL API documentation](https://gitlab.com/dword4/nhlapi).
