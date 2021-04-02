<View style={styles.settingRow}>
    <Text style={styles.setting}>Location:</Text>
    <Switch 
        // value={this.state.settings.location}
        onValueChange={(val) => console.log(val)}
    ></Switch>
    {/* <Text style={styles.setting}>{this.state.settings.location ? 'On' : 'Off'}</Text> */}
</View>
{this.state.settings.location ? 
    <View style={styles.settingRow}>
        <Text style={styles.setting}>Location:</Text>
        {/* <Text style={styles.setting}>{this.state.settings.location ? 'On' : 'Off'}</Text> */}
    </View>
:
    <View></View>
}
<View style={styles.settingRow}>
    <Text style={styles.setting}>Location:</Text>
    {/* <Text style={styles.setting}>{this.state.settings.location ? 'On' : 'Off'}</Text> */}
</View>