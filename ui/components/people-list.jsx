/* jshint browser: true */

module.exports = function(core, config, store) {
	var React = require("react"),
		ListView = require("./list-view.jsx")(core, config, store),
		PeopleList,
		peoplelistEl = document.getElementById("js-people-list");

	PeopleList = React.createClass({
		render: function() {
			return (<ListView sections={this.props.sections} />);
		}
	});

	core.on("statechange", function(changes, next) {
		var people, room, user, items,
			sections = {
				online: [],
				offline: []
			},
			arr = [];

		if (("indexes" in changes && "roomUsers" in changes.indexes) || (/^(room|chat)$/).test(store.get("nav", "mode"))) {
			room = store.getRoom();
			people = store.get("indexes", "roomUsers", store.get("nav", "room"));

			for (var i = 0, l = people.length; i < l; i++) {
				if (sections[people[i].status]) {
					user = store.get("entities", people[i].user);

					sections[people[i].status].push({
						key: "people-list-" + room + "-" + user.id,
						elem: (
						    <div className="people-list-item">
						      	<img className="people-list-item-avatar" src={user.picture} />
						      	<span className="people-list-item-nick">{user.id}</span>
						    </div>
						)
					});
				}
			}

			for (var status in sections) {
				items = sections[status];

				if (items.length) {
					arr.push({
						key: "people-list-" + status,
						header: status.charAt(0).toUpperCase() + status.slice(1) + " (" + items.length + ")",
						items: items
					});
				}
			}

			React.render(<PeopleList sections={arr} />, peoplelistEl);
		}

		next();
	}, 500);

	return PeopleList;
};
