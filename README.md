# 📞 Phonebook Application

A modern, responsive web-based phonebook application with a clean UI and full CRUD functionality. Manage your contacts with ease, featuring image uploads, favorites, and real-time search.

## ✨ Features

- **📱 Contact Management**: Add, edit, view, and delete contacts
- **🖼️ Image Support**: Upload contact photos (max 1MB, PNG/JPG)
- **⭐ Favorites System**: Mark contacts as favorites for quick access
- **🔍 Real-time Search**: Instantly search through your contacts
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🎨 Modern UI**: Clean, intuitive interface with Font Awesome icons
- **🔄 Dual Backend Support**: Choose between Node.js/Express or Python HTTP server

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox/grid
- **JavaScript (ES6+)** - Dynamic functionality with classes and async/await
- **Font Awesome** - Icon library

### Backend Options
- **Node.js + Express** - RESTful API with CORS support
- **Python HTTP Server** - Simple static file server with CORS headers

## 📁 Project Structure
```
phonebook-app/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # Frontend JavaScript
├── server.js           # Node.js/Express backend
├── server.py           # Python HTTP server
├── package.json        # Node.js dependencies
├── package-lock.json   # Dependency lock file
└── README.md           # This file
```

## 🚀 Getting Started

### Option 1: Using Node.js/Express Backend

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   node server.js
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5000`

### Option 2: Using Python HTTP Server

1. **Start the Python server:**
   ```bash
   python server.py
   ```

2. **Open your browser:**
   Navigate to `http://localhost:8001`

## 📋 API Endpoints (Node.js Backend)

- `GET /api/contacts` - Retrieve all contacts
- `POST /api/contacts` - Create a new contact
- `PUT /api/contacts/:id` - Update a contact
- `DELETE /api/contacts/:id` - Delete a contact

## 🎯 Key Features Explained

### Contact Management
- Add contacts with name, phone, email, address, and notes
- Upload contact images (converted to Data URLs)
- Edit existing contacts with pre-filled forms
- Delete contacts with confirmation dialog

### Favorites System
- Mark/unmark contacts as favorites
- Filter view to show only favorite contacts
- Favorite count displayed in header

### Search Functionality
- Real-time search across all contact fields
- Case-insensitive matching
- Instant results as you type

### Image Handling
- File size validation (max 1MB)
- Support for PNG and JPG formats
- Automatic conversion to Data URLs
- Image persistence across edits

## 🎨 UI/UX Features

- **Modal Dialogs**: Clean popup forms for add/edit operations
- **Empty States**: Helpful messages when no contacts exist
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Responsive Grid**: Adapts to different screen sizes
- **Smooth Animations**: CSS transitions for better UX

## 🔧 Customization

### Styling
Modify `styles.css` to customize:
- Color scheme
- Typography
- Layout spacing
- Button styles
- Modal appearance

### Functionality
Extend `script.js` to add:
- Additional contact fields
- Contact categories/groups
- Import/export functionality
- Contact sharing features
- Backup/restore options

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [ISC License](LICENSE).

## 🙏 Acknowledgments

- Font Awesome for the beautiful icons
- Modern CSS techniques for responsive design
- JavaScript ES6+ features for clean code structure

## 📞 Support

If you have any questions or issues, please open an issue on GitHub or contact the development team.

---

**Happy contact managing!** 📱✨
