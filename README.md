# Hashmarks

Web application that allows users to search active NHL players
and view visualizations for individual player statistics. See
[system architecture](https://github.com/rosszm/hashmarks/wiki#system-architecture)
for more detailed design and implementation details.

[View Demo](https://rosszm.github.io/hashmarks)

## Dependencies
- Python >= 3.10
- Node >= v16.11.1
- PostgreSQL >= 12.9

## Local Installation (dev)

It is highly recommended you use a virtual environment for installing and
running the separate projects. See
[Creating Virtual Environments](https://docs.python.org/3/library/venv.html#creating-virtual-environments).

Note: the database service and API are configured to use the root user. Use `sudo bash` to run the
setup in a root user shell. Alternatively, instances of "root" can be replace with the current user.

### Clone the repository and open directory
```sh
git clone https://github.com/rosszm/hashmarks.git
cd hashmarks
```

### Set up the database
It is required that a PostgreSQL database named `hockey` and the user `root` exist prior to the
following steps.

Use the `create_tables.py` script to generate the database tables:
```sh
pip install -r db/requirements.txt
python3 db/hockey_db/create_tables.py
```

Use `update_service.py` to pull the data from the past 24 hours to the database:
```sh
python3 db/hockey_db/update_service.py
```

To pull data from > 24 hours ago, use the
[`hockey_db.update_service.update()`](https://github.com/rosszm/hashmarks/blob/master/db/hockey_db/update_service.py#L37)
function.
### Install Python dependencies and start API
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

[War on Ice](https://github.com/war-on-ice) - for their [ice rink visualization](https://github.com/war-on-ice/icerink).