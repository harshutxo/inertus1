# Requirements Installer

This project is a simple Python script that automates the process of checking for a `requirements.txt` file in a specified directory and installing the listed packages using `pip`.

## Features

- Lists all files in the specified directory.
- Checks for the presence of a `requirements.txt` file.
- Installs packages listed in `requirements.txt` using `pip`.
- Provides detailed feedback on the installation process and any errors encountered.

## Prerequisites

- Python 3.x installed on your system.
- `pip` should be installed and available in your system's PATH.

## Usage

1. **Clone the Repository**: Clone this repository to your local machine.

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Run the Script**: Execute the script using Python.

   ```bash
   python script_name.py
   ```

3. **Specify Directory**: When prompted, enter the directory path you want to check for `requirements.txt`. Leave blank to use the current directory.

4. **Installation**: If `requirements.txt` is found, the script will attempt to install the packages listed in it.

## Error Handling

- If the specified directory is not found, an error message will be displayed.
- If `requirements.txt` is not found in the directory, the script will notify you.
- Any errors during the package installation process will be reported.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## Contact

For any questions or feedback, please contact [Your Name] at [Your Email].
